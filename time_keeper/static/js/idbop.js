  //Open new IndexedDB conncetion.
  var dbPromise = idb.open('time-db', 5, function(upgradeDb) {
    upgradeDb.createObjectStore('records',{keyPath:'pk'});
  });
  //collect latest post from server and store in idb.
  fetch('http://127.0.0.1:8000/getdata').then(function(response){
    return response.json();
  }).then(function(jsondata){
    dbPromise.then(function(db){
      var tx = db.transaction('records', 'readwrite');
        var recordsStore = tx.objectStore('records');
        console.log(jsondata)
        for(var key in jsondata){
          console.log(key)
          if (jsondata.hasOwnProperty(key)) {
            recordsStore.put(jsondata[key]);  
          }
        }
    });
  });
  //retrive data from idb and display on page.
/*  var post="";
  dbPromise.then(function(db){
    var tx = db.transaction('feeds', 'readonly');
      var feedsStore = tx.objectStore('feeds');
      return feedsStore.openCursor();
  }).then(function logItems(cursor) {
      if (!cursor) {
        //if true means we are done cursoring over all records in feeds.
        document.getElementById('offlinedata').innerHTML=post;
        return;
      }
      for (var field in cursor.value) {
          if(field=='fields'){
            feedsData=cursor.value[field];
            for(var key in feedsData){
              if(key =='title'){
                var title = '<h3>'+feedsData[key]+'</h3>';
              }
              if(key =='author'){
                var author = feedsData[key];
              }
              if(key == 'body'){
                var body = '<p>'+feedsData[key]+'</p>';
              } 
            }
            post=post+'<br>'+title+'<br>'+author+'<br>'+body+'<br>';
          }
        }
      return cursor.continue().then(logItems);
    });*/