'use strict';

var request = require("request"),
    elasticsearch = require('elasticsearch');

// Load env variables
require('dotenv').config({silent: true});

var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL,
  apiVersion: '1.5'
});

var totalCount;
var perRequest = 5000;
var numberOfRequests;
var currentRequest = 64;
var currentTotalAdded = 0;

getPackageCount();

function getPackageCount(){
   console.log("Getting package count.");
  request({
    url: "https://skimdb.npmjs.com/registry/",
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
    var request_url = "https://skimdb.npmjs.com/registry/_all_docs?" +
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
    var nmpDataPacketList = packets.map(function(packet){
      return packet.doc.name ;
    });
    // We have to split the request up due to url length issues
    var perDownloadRequest = 50;
    var totalDownloadRequests = packets.length / perDownloadRequest;

    requestPackageDownloads();
    function requestPackageDownloads(){
      for( var i = 0; i < totalDownloadRequests; i++ ){
        var arrStart = i * perDownloadRequest;
        var arrEnd = arrStart + perDownloadRequest;
        var packetList = nmpDataPacketList.slice(arrStart, arrEnd).join(',');
        var request_url = "http://api.npmjs.org/downloads/point/last-month/" + packetList;
        request({
          url: request_url,
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        }, function(error, response, body){
          if (error) {
            console.log("Error getting npm package downloads, will retry.")
            requestPackageDownloads();
          }
          if (!error) {
            var body_data = JSON.parse(body);
            combineDownloadsData(body_data);
          }
        });
      }
    }

    var currentCount = 0;
    var combinedDownloadsHash = {};

    function combineDownloadsData(data){
      for (var attrname in data) { combinedDownloadsHash[attrname] = data[attrname]; }
      currentCount += 1;
      if(currentCount === totalDownloadRequests){
        console.log("Combined npm download count data");
        addPacketDownloads(combinedDownloadsHash);
      }
    }

    function addPacketDownloads(packetDownloads){
      var packetsWithDownloads = [];
      for( var i = 0; i < packets.length; i++){
        var newPacket = packets[i];
        var packetName = newPacket.doc.name ? newPacket.doc.name : newPacket.id;
        newPacket.downloads = packetDownloads[packetName] ? packetDownloads[packetName].downloads : 0;
        packetsWithDownloads.push(newPacket);
      }
      handleData(packetsWithDownloads);
    }
  }

  function handleData(data){
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
    updateElasicsearch();
    function updateElasicsearch(){
      client.bulk({
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
  }

  function handleFinish(){
    currentRequest += 1;
    console.log("Total added to elastic search: " + currentTotalAdded);
    if( currentRequest < numberOfRequests ){
      getAndStoreDataLoop();
    }
  }
}


