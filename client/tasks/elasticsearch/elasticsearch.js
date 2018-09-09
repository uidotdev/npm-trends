const retry = require('async-retry');
const fetch = require('node-fetch');
const esClient = require('./esClient');

const updateElasicsearch = async (formatted_data) => {
  await esClient.bulk({
    body: formatted_data
  }, function(error, response){
    if (error) {
      console.log(error);
      console.log("Error updating elasticsearch, will retry.");
      updateElasicsearch(formatted_data);
    }
    if (!error) {
      console.log('Added ' + response.items.length + ' to elasticsearch');
    }
  });
}

const addPacketsToElasticsearch = async (data) => {
  var formatted_data = [];
  data.forEach(function(packet){
    // only index packages with over 100 downloads in last month
    if(packet.downloads > 100){
      var esAction = { index: {_index: 'npm', _type: 'autocomplete', _id: packet.id } };
      var packetDocument = {
        name: packet.doc.name ? packet.doc.name : packet.id,
        description: packet.doc.description ? packet.doc.description : '',
        keywords: packet.doc.keywords ? packet.doc.keywords : [],
        downloads: packet.downloads,
        suggest: {
          input: packet.doc.name ? packet.doc.name : packet.id,
          payload: {
            id: packet.id,
            description: packet.doc.description ? packet.doc.description : ''
          },
          weight: packet.downloads
        }
      }
      formatted_data.push(esAction);
      formatted_data.push(packetDocument);
    };
  });

  if(formatted_data.length){
    await updateElasicsearch(formatted_data);
  }else{
    console.log('No packages to add to elasticsearch');
  }
}

const formatScopedPacketsWithDownloads = (packetsByName, packetDownloads) => {
  // ex. packetDownloads: http://api.npmjs.org/downloads/point/last-month/@angular/core
  // {"downloads":1432845,"start":"2017-04-21","end":"2017-05-20","package":"@angular/core"}
  const packetName = packetDownloads.package;
  let packetToAdd = packetsByName[packetName];
  packetToAdd.downloads = packetDownloads.downloads;
  console.log("Combined npm download count data for scoped package: " + packetName);
  return packetToAdd;
}

const formatNonScopedPacketsWithDownloads = (packetsByName, packetDownloads) => {
  // ex. packetDownloads: http://api.npmjs.org/downloads/point/last-month/react,redux
  // {"react":{"downloads":4161358,"package":"react","start":"2017-04-21","end":"2017-05-20"},"redux":{"downloads":2208086,"package":"redux","start":"2017-04-21","end":"2017-05-20"}}
  const packetsWithDownloads = Object.keys(packetDownloads).map(packetName => {
    let packetToAdd = packetsByName[packetName];
    packetToAdd.downloads = packetDownloads[packetName] ? packetDownloads[packetName].downloads : 0;
    return packetToAdd;
  });
  console.log("Combined npm download count data for non-scoped packages");
  return packetsWithDownloads;
}

const filterErrors = (arrayOfResponses) => {
  return arrayOfResponses.filter(response => {
    return !response.error;
  })
}

const fetchPackageDownloadsForScoped = async (scopedPackages) => {
  return await Promise.all(scopedPackages.map(async (scopedPackageName) => {
    var request_url = "https://api.npmjs.org/downloads/point/last-month/" + scopedPackageName;
    return await retry(async (bail) => (
      await fetch(request_url, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async(response) => await response.json())
    ), {
      onRetry: (error) => { console.log('Retrying because of:', error.message) },
    });
  }));
}

const fetchPackageDownloads = async (nonScopedNpmDataPacketList, totalDownloadRequests, perDownloadRequest) => {
  return await Promise.all([...Array(totalDownloadRequests)].map(async (_, i) => {
    var arrStart = i * perDownloadRequest;
    var arrEnd = arrStart + perDownloadRequest;
    var packetList = nonScopedNpmDataPacketList.slice(arrStart, arrEnd).join(',');
    var request_url = "https://api.npmjs.org/downloads/point/last-month/" + packetList;
    return await retry(async (bail) => (
      await fetch(request_url, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async(response) => await response.json())
    ), {
      onRetry: (error) => { console.log('Retrying because of:', error.message) },
    });
  }));
}

// Get download count in past month for ranking
const getNpmDownloads = async (packets) => {

  // Once we get the download count for each package,
  // we'll store the original packet data + download count in this array
  let packetsWithDownloads = [];

  // Packets Object with ID
  let packetsByName = {};
  packets.forEach(function(packet){
    const packetName = packet.doc.name ? packet.doc.name : packet.id;
    packetsByName[packetName] = packet;
  })

  // Array of all package names
  const npmDataPacketList = packets.map(function(packet){
    return packet.doc.name ? packet.doc.name : packet.id;
  });

  // Array of all non-scoped package names
  const nonScopedNpmDataPacketList = npmDataPacketList.filter(function(packetName){
    if(!packetName.includes("@")) return true;
  });

  // Array of all scoped package names (ex @angular/core)
  const scopedNpmDataPacketList = npmDataPacketList.filter(function(packetName){
    if(packetName.includes("@")) return true;
  });

  // DOWNLOAD COUNTS FOR NON-SCOPED PACKAGES
  // Request download counts in a batch requests (scoped packages aren't supported yet for batch)
  // We have to split the request up due to url length issues
  let perDownloadRequest = 50;
  let totalDownloadRequests = Math.ceil(nonScopedNpmDataPacketList.length / perDownloadRequest);

  let nonScopedPackageDownloads = await fetchPackageDownloads(
    nonScopedNpmDataPacketList,
    totalDownloadRequests,
    perDownloadRequest
  );
  nonScopedPackageDownloads = filterErrors(nonScopedPackageDownloads);

  // DOWNLOAD COUNTS FOR SCOPED PACKAGES

  let scopedPackageDownloads = await fetchPackageDownloadsForScoped(scopedNpmDataPacketList);
  scopedPackageDownloads = filterErrors(scopedPackageDownloads);

  // Add fetched download counts to original package data

  let formattedNonScopedPackages = [];
  nonScopedPackageDownloads.forEach(nonScopedRequestResponse => {
    const formattedResponse = formatNonScopedPacketsWithDownloads(packetsByName, nonScopedRequestResponse);
    formattedNonScopedPackages = formattedNonScopedPackages.concat(formattedResponse);
  });

  const formattedScopedPackages = scopedPackageDownloads.map(scopedPackage => {
    return formatScopedPacketsWithDownloads(packetsByName, scopedPackage);
  });

  const formattedPackages = [...formattedNonScopedPackages, ...formattedScopedPackages];

  return formattedPackages;
}

const fetchPackageInfo = async (currentRequest, perRequest) => {
  const request_url = "https://replicate.npmjs.com/registry/_all_docs?" +
                    "include_docs=true&" +
                    "limit=" + perRequest + "&" +
                    "skip=" + (perRequest * currentRequest);

  return await retry(async (bail) => (
    await fetch(request_url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async(response) => {
      return await response.json().then(body => body.rows);
    })
  ), {
    onRetry: (error) => { console.log('Retrying because of:', error.message) },
  });
}

const getPackageCount = async () => {
  return await retry(async (bail) => {
    console.log("Getting package count.");
    return await fetch("https://replicate.npmjs.com/registry/", {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async(response) => await response.json());
  }, {
    onRetry: (error) => { console.log('Retrying because of:', error.message) },
  });
}

const indexPackages = async () => {
  var totalCount;
  const perRequest = 200; // Number of packages to fetch from npm at a time
  const startAtLoop = 3911;

  await getPackageCount()
    .then(response => {
      totalCount = response.doc_count;
    });

  const totalRequestsCount = Math.ceil(totalCount / perRequest);
  const requiredRequestsCount = totalRequestsCount - startAtLoop + 1;

  for (let i = 0; i < requiredRequestsCount; i++) {
    const loopNumber = i + startAtLoop;

    console.log("Request loop " + loopNumber + " of " + totalRequestsCount);

    const rawPackages =  await fetchPackageInfo(loopNumber, perRequest);

    console.log("Received npm data");

    const packagesWithDownloads = await getNpmDownloads(rawPackages);

    await addPacketsToElasticsearch(packagesWithDownloads);
  };

  console.log("All packages added!")
}

indexPackages();
