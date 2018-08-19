const request = require('request');
const esClient = require('./esClient');

var totalCount;
var perRequest = 128; // npm download count bulk limit
var numberOfRequests;
var currentRequest = 0;
var currentTotalAdded = 0;

getPackageCount();

function getPackageCount(){
  console.log("Getting package count.");
  request({
    url: "https://replicate.npmjs.com/registry/",
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01'
    }
  }, function(error, response, body){
    if (error) {
      console.log("Error getting package count, will retry.");
      getPackageCount();
    }
    if (!error && response.statusCode == 200) {
      var body_data = JSON.parse(body);
      totalCount = body_data.doc_count;
      numberOfRequests = Math.ceil( totalCount / perRequest );
      getAndStoreDataLoop();
    }
  });
}

function getAndStoreDataLoop(){
  console.log("Loop " + currentRequest + " of " + numberOfRequests);

  getNpmData();
  function getNpmData(){
    var request_url = "https://replicate.npmjs.com/registry/_all_docs?" +
                      "include_docs=true&" +
                      "limit=" + perRequest + "&" +
                      "skip=" + (perRequest * currentRequest) ;
    requestPackageInfo();
    function requestPackageInfo(){
      request({
        url: request_url,
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01'
        }
      }, function(error, response, body){
        if (error) {
          console.log("Error getting npm packages list, will retry.")
          requestPackageInfo();
        }
        if (!error) {
          console.log("Received npm data");
          var body_data = JSON.parse(body);
          getNpmDownloads(body_data.rows);
        }
      });
    }
  }

  // Get download count in past month for ranking
  function getNpmDownloads(packets){

    // Once we get the download count for each package,
    // we'll store the original packet data + download count in this array
    let packetsWithDownloads = [];

    // Mark loops as completed
    let nonScopedLoopDone = false;
    let scopedLoopDone = false;

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
    const notScopedNpmDataPacketList = npmDataPacketList.filter(function(packetName){
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
    let totalDownloadRequests = Math.ceil(notScopedNpmDataPacketList.length / perDownloadRequest);

    if(notScopedNpmDataPacketList.length){
      requestPackageDownloads();
    }else{
      nonScopedLoopComplete();
    }

    function requestPackageDownloads(){
      for( var i = 0; i < totalDownloadRequests; i++ ){
        var arrStart = i * perDownloadRequest;
        var arrEnd = arrStart + perDownloadRequest;
        var packetList = notScopedNpmDataPacketList.slice(arrStart, arrEnd).join(',');
        var request_url = "https://api.npmjs.org/downloads/point/last-month/" + packetList;
        let retry_count = 0;
        request({
          url: request_url,
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        }, function(error, response, body){
          if (error) {
            retry_count += 1;
            if(retry_count < 5){
              console.log("Error getting npm package downloads, will retry: attempt " + retry_count);
              requestPackageDownloads();
            }else{
              console.log("Error getting npm package downloads, will not retry")
              nonScopedLoopComplete();
            }
          } else {
            const body_data = body ? JSON.parse(body) : false;

            if(body_data && !body_data.error){
              addNonScopedPacketsWithDownloads(body_data);
            }else{
              nonScopedLoopComplete();
            }
          }
        });
      }
    }

    function addNonScopedPacketsWithDownloads(packetDownloads){
      // ex. packetDownloads: http://api.npmjs.org/downloads/point/last-month/react,redux
      // {"react":{"downloads":4161358,"package":"react","start":"2017-04-21","end":"2017-05-20"},"redux":{"downloads":2208086,"package":"redux","start":"2017-04-21","end":"2017-05-20"}}
      for(var packetName in packetDownloads){
        let packetToAdd = packetsByName[packetName]
        packetToAdd.downloads = packetDownloads[packetName] ? packetDownloads[packetName].downloads : 0;
        packetsWithDownloads.push(packetToAdd);
      }
      console.log("Combined npm download count data for non-scoped packages");
      nonScopedLoopComplete();
    }

    function nonScopedLoopComplete(){
      nonScopedLoopDone = true;
      addToElasticSearch();
    }


    // DOWNLOAD COUNTS FOR SCOPED PACKAGES
    let scopedLoopsCompleted = 0;

    if(!scopedNpmDataPacketList.length){
      scopedLoopComplete();
    }

    scopedNpmDataPacketList.forEach(function(scopedPackageName){
      requestPackageDownloadsForScoped();
      function requestPackageDownloadsForScoped(){
        var request_url = "https://api.npmjs.org/downloads/point/last-month/" + scopedPackageName;
        let retry_count = 0;
        request({
          url: request_url,
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        }, function(error, response, body){
          const body_data = body ? JSON.parse(body) : false;
          if (error) {
            retry_count += 1;
            if(retry_count < 5){
              console.log("Error getting npm scoped package downloads, will retry: attempt " + retry_count);
              requestPackageDownloadsForScoped();
            }else{
              console.log("Error getting npm scoped package downloads, will not retry");
              scopedLoopComplete();
            }
          }else if(body_data && !body_data.error){
            addScopedPacketsWithDownloads(body_data);
          }else{
            scopedLoopComplete();
          }
        });
      }
    });

    function addScopedPacketsWithDownloads(packetDownloads){
      // ex. packetDownloads: http://api.npmjs.org/downloads/point/last-month/@angular/core
      // {"downloads":1432845,"start":"2017-04-21","end":"2017-05-20","package":"@angular/core"}
      const packetName = packetDownloads.package;
      let packetToAdd = packetsByName[packetName];
      packetToAdd.downloads = packetDownloads.downloads;
      packetsWithDownloads.push(packetToAdd);
      console.log("Combined npm download count data for scoped package: " + packetName);
      scopedLoopComplete();
    }

    function scopedLoopComplete(){
      scopedLoopsCompleted += 1;
      if(scopedLoopsCompleted >= scopedNpmDataPacketList.length){
        scopedLoopDone = true;
        addToElasticSearch();
      }
    }

    function addToElasticSearch(){
      if(nonScopedLoopDone && scopedLoopDone){
        // ADD PACKAGES WITH DOWNLOAD COUNTS TO ELASTICSEARCH
        console.log("Adding combined npm packages to elasticsearch");
        addPacketsToElasticsearch(packetsWithDownloads);
      }
    }
  }

  function addPacketsToElasticsearch(data){
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
      updateElasicsearch();
      function updateElasicsearch(){
        esClient.bulk({
          body: formatted_data
        }, function(error, response){
          if (error) {
            console.log(error);
            console.log("Error updating elasticsearch, will retry.");
            updateElasicsearch();
          }
          if (!error) {
            console.log('Added ' + response.items.length + ' to elasticsearch');
            currentTotalAdded = currentTotalAdded + response.items.length;
            handleFinish();
          }
        });
      }
    }else{
      console.log('No packages added to elasticsearch');
      handleFinish();
    }
  }

  function handleFinish(){
    currentRequest += 1;
    console.log("Total added to elastic search: " + currentTotalAdded);
    if( currentRequest < numberOfRequests ){
      getAndStoreDataLoop();
    }
  }
}
