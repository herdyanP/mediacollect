// Dom7
// sudo cordova build android --release -- --keystore=lightpos.keystore --storePassword=bismillah --alias=lightpos --password=bismillah
// C:\Program Files\Java\jre1.8.0_221\bin>keytool -genkey -v -keystore sisco.keystore -alias sisco -keyalg RSA -keysize 2048 -validity 10000

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.collectionapp',
  root: '#app',
  init: false,
  // theme: theme,
  routes: routes,
});

document.addEventListener('deviceready', function() {
  app.init();
});

function onNewLogin(form){
  app.views.main.router.navigate('/home/');
}

function cekCIF(src, event, value){
  if ( (window.event ? event.keyCode : e.which) == 13) { 
    switch(src){
      case "cif":
        console.log('cif', value);
        break;

      case "coll_s":
        console.log('coll_s', value);
        break;

      case "coll_a":
        console.log('coll_a', value);
        break;
    }
  }
}