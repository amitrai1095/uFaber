let underscore = require('underscore')
let mkdirp = require('mkdirp');
let extract = require('extract-zip')
let isInUnitsComponent = false
let isInVideosComponent = false
let justLoggedOutFlag = false
const Downloader = require('./assets/lib/filedownloader')
let downloadInstances = []
let downloadInstanceKey = 0
var http = require('http');
var fileSystem  = require('fs');
let ProgressBar = require('progressbar.js')

let footerStyle = 0 // 0 indicates styling properties for login screen and 1 indicates style properties for other screens
let downloadQueue = [
  
] // Array to store info of videos to be downloaded
let unitDownloadProgress = [
  
] // Array to store the download progress of units

// Function to create directories for vidoes
function createDirectories(directoryList){
  for(let i=0; i<directoryList.length; i++){
    mkdirp(directoryList[i], function (err) {
      if (err){
        console.error(err)
      }
      else{
        console.log('pow!')
      }
    });
  }
}

function showAlert(){
  alert('Video not yet downloaded. Please download the video first', "Warning")
}

function showFailedError(){
  alert('Unable to connect to the Internet', "Warning")
}

function showInCorrectCredsError(){
  alert('Invalid Credentials', "Warning")
}

function showInCorrectEmailError(){
  alert('Invalid EMail ID', "Warning")
}

function setIsInUnitsFlag(){
  isInUnitsComponent = true
  isInVideosComponent = false
}

function setIsInVideosFlag(){
  isInUnitsComponent = false
  isInVideosComponent = true
}

// Function to extract the video from the ZIP file
function extractZip(arg){
  let indexOfCurrentVideo = downloadQueue.findIndex(x => x.videoUrl === arg.videoUrl)
  let currentUnitId = downloadQueue[indexOfCurrentVideo].unitId
  let indexOfCurrentUnit = unitDownloadProgress.findIndex(x => x.unitId === currentUnitId)
  
  let videoUrl = arg.downloadPath + '/' + arg.downloadAs.split('.')[0]
  let zipPath = 'assets/' + arg.downloadPath + '/' + arg.downloadAs
  let targetPath = 'assets/' + videoUrl + '/' // Use this path for development
  // let targetPath = '../../assets/' + videoUrl + '/' // Use this path in production

  const path = require('path')
  let t = path.join(__dirname, targetPath)
  extract(zipPath, {dir: t}, function (err) {
      if(err){
        console.log(err)
      }
      downloadQueue[indexOfCurrentVideo].isCompleted = true
      unitDownloadProgress[indexOfCurrentUnit].downloadInProgress = false
      if(isInUnitsComponent){
        updateUnitInterface(arg)
      }
      if(isInVideosComponent){
        updateVideoInterface(arg, 0, videoUrl)
      }
      saveVideoLocalPath(arg.videoUrl, videoUrl)
    })
}

// Function to toggle the style of footer on login screen
function toggleFooterStyle(){
  switch(footerStyle){
    case 0:
      footerStyle = 1
      document.getElementById('footer').style.background = "rgba(77,52,47, 1)"
      document.getElementById('powered-by-text').style.color = "rgba(255, 255, 255, 1)"
      document.getElementById('powered-by-info-text').style.color = "rgba(255, 255, 255, 1)"
      break

    case 1:
      footerStyle = 0
      document.getElementById('footer').style.background = "rgba(0, 0, 0, 0)"
      document.getElementById('powered-by-text').style.color = "rgba(65,57,53, 1)"
      document.getElementById('powered-by-info-text').style.color = "rgba(65,57,53, 1)"
      break
  }
}

function pause(){
  let vid = document.getElementById('videoPlayer');
  vid.pause();
  setTimeout(function(){
    vid.play();
  }, 3000);
}

// FUnction to download a video
function downloadVideo(videoUrl, downloadPath, downloadAs){
  let arg = {
    'videoUrl': videoUrl,
    'downloadPath': downloadPath,
    'downloadAs' : downloadAs
  }
  console.log(arg)
  getVideo(arg)
}

function getVideo(fileObject){
  let completeDownloadPath = 'assets/' + fileObject.downloadPath + '/' + fileObject.downloadAs
  let downloadUrl = fileObject.videoUrl
  downloadUrl = 'http://' + downloadUrl.split('://')[1]

  http.get(downloadUrl, function(response) {
    response.pipe(fileSystem.createWriteStream(completeDownloadPath))
    response.on('end', function(){
      extractZip(fileObject)
    })
  });
}

function test(arg){
  // console.log('in download video')
  // let downloadPath = arg.downloadPath
  // downloadPath = 'assets/' + downloadPath
  // console.log(arg)
  // downloadInstances.push(new Downloader({url: arg.videoUrl, resume: true, saveto: downloadPath, deleteIfExists: true}))
  // downloadInstances[downloadInstanceKey].on("progress", function(data){
  //   // event.sender.send('video-download-progress', data)
  //   console.log(data)
  //   updateVideoInterface(data, 1)
  // })
  // downloadInstances[downloadInstanceKey].on("error", function(data){
  //   console.log(data)
  // })
  // downloadInstances[downloadInstanceKey].on("end", function(data){
  //   // event.sender.send('video-downloaded', data)
  //   console.log(data)
  //   extractZip(data)
  // })
  // downloadInstanceKey++
}

// FUnction to add all videos of a unit in downloads
function downloadUnit(unitId){
  videosDb.find({
    unitId: unitId
  }, function(err, videos){
    if(err || videos.length === 0){

    }
    else{
      for(var i=0; i<videos.length; i++){
        addToDownloadQueue(videos[i].id, videos[i].url, unitId, videos[i].courseId)
      }
    }
  })
}

// FUnction to add video Id in downloads
function addToDownloadQueue(videoId, videoUrl, unitId, courseId){
  if(underscore.where(downloadQueue, {videoId: videoId, unitId: unitId}).length === 0){
    let downloadObject = {
      'videoId': videoId,
      'unitId': unitId,
      'videoUrl': videoUrl,
      'isCompleted': false
    }

    let objectsInQueue = underscore.where(downloadQueue, {unitId: unitId}).length
    let completedObjectsInQueue = underscore.where(downloadQueue, {unitId: unitId, isCompleted: true}).length
    let completionPercentage = completedObjectsInQueue/(objectsInQueue + 1)
    completionPercentage = completionPercentage*100
    completionPercentage = completionPercentage.toFixed(0)
    
    let unitDownloadProgressObject = {
      'unitId': unitId,
      'progress': completionPercentage,
      'downloadInProgress': true
    }

    if(underscore.where(unitDownloadProgress, {unitId: unitId}).length > 0){
      let indexOfUnit = unitDownloadProgress.findIndex(x => x.unitId === unitId)
      unitDownloadProgress[indexOfUnit].progress = completionPercentage
    }
    else{
      unitDownloadProgress.push(unitDownloadProgressObject)
    }
    downloadQueue.push(downloadObject)
    let downloadPath = courseId + "/" + unitId
    let downloadAs = videoUrl.split('/')[videoUrl.split('/').length - 1]
    downloadVideo(videoUrl, downloadPath, downloadAs)
  }
}

// FUnction to check if passed unit Id is currently in downloads
function checkIfUnitInDownloads(unitId){
  let returnValue = false
  if(underscore.where(unitDownloadProgress, {unitId:unitId, downloadInProgress : true}).length > 0){
    returnValue = true
  }
  return returnValue
}

// FUnction to check if passed video Id is currently in downloads
function checkIfVideoInDownloads(videoId){
  let returnValue = false
  let array = underscore.where(downloadQueue, {videoId:videoId})
  console.log(array)
  if(array.length > 0 && !array.isCompleted){
    returnValue = true
  }

  return returnValue
}

function saveVideoLocalPath(videoUrl, path){
  videosDb.update({
    url : videoUrl
  }, {
    $set : {
      localPath : path,
      isDownloaded : true
    }
  }, function(err, docs){})
}

// Function to hide loading screen
function hideLoadingScreen(){

}

// Function to show loading screen
function showLoadingScreen(){

}

function logoutUser(){
  console.log('coming to handler function')
  userDb.remove({}, { multi: true }, function (err, numRemoved) {
    coursesDb.remove({}, { multi: true }, function (err, numRemoved) {
      unitsDb.remove({}, { multi: true }, function (err, numRemoved) {
        videosDb.remove({}, { multi: true }, function (err, numRemoved) {
          console.log('calling component function')
          justLoggedOutFlag = true
          reLoadDatabases()
          navigateToLogin()
        });
      });
    });
  });
}