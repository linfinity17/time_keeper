  //Open new IndexedDB conncetion.
  var dbPromise = idb.open('time-db', 5, function(upgradeDb) {
    upgradeDb.createObjectStore('records',{keyPath:'pk'});
  });

  //collect latest post from server and store in idb.
  fetch('/getdata').then(function(response){
    return response.json();
  }).then(function(jsondata){
    dbPromise.then(function(db){
      var tx = db.transaction('records', 'readwrite');
        var recordsStore = tx.objectStore('records');
        for(var key in jsondata){
          if (jsondata.hasOwnProperty(key)) {
            recordsStore.put(jsondata[key]);
          }
        }
    });
  });
  //retrive data from idb and display on page.
  if (window.location.pathname == "/postdata") {
  var post="<tr><th>Date</th><th>Primary Task</th><th>Sub Task</th><th>Start Time</th><th>End Time</th></tr>";
  dbPromise.then(function(db){
    var tx = db.transaction('records', 'readonly');
      var recordsStore = tx.objectStore('records');
      return recordsStore.openCursor();
  }).then(function logItems(cursor) {
      if (!cursor) {
        //if true means we are done cursoring over all records in records.
        document.getElementById('offline_data').innerHTML=post;
        return;
      }
      for (var field in cursor.value) {
          if(field=='fields'){
            recordsData=cursor.value[field];
            console.log(recordsData);
            for(var key in recordsData){
              if(key =='task_date'){
                var task_date = '<td>'+new Date(recordsData[key]).toLocaleDateString()+'</td>';
              }
              if(key =='primary_task'){
                var primary_task = '<td>'+recordsData[key]+'</td>';
              }
              if(key =='sub_task'){
                var sub_task = '<td>'+recordsData[key]+'</td>';
              }
              if(key =='start_time'){
                var start_time = '<td>'+new Date(recordsData[key]).toLocaleTimeString()+'</td>';
              }
              if(key =='end_time'){
                var end_time = '<td>'+new Date(recordsData[key]).toLocaleTimeString()+'</td>';
              }
            }
            post=post+'<tr>'+task_date+primary_task+sub_task+start_time+end_time+'</tr>';
          }
        }
      return cursor.continue().then(logItems);
    });
}