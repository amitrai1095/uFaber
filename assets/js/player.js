function initApp(videoPath) {
  shaka.polyfill.installAll();
  shaka.Player.support().then(function(support) {
    if (support.supported) {
      initPlayer(videoPath);
    } else {
      console.error('Browser not supported!');
    }
  });
}

function initPlayer(videoPath) {
  var video = document.getElementById('videoPlayer');
  var player = new shaka.Player(video);
  var videoUrl;

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  player.configure({
    drm: {
      clearKeys: {
        '91341951696b5e1ba232439ecec1f12a': '0a247b0751cbf1a827e2fedfb87479a2'
      }
    }
  });
  
  videoUrl = 'http://localhost:3000/'+ videoPath +'/stream.mpd';

  player.load(videoUrl).then(function() {
    console.log('The video has now been loaded!');
  }).catch(function(e) {
    console.log(e);
  });
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error('Error code', error.code, 'object', error);
}
