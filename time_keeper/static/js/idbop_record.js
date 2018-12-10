  var dbPromise_record = idb.open('record-db', 5, function(upgradeDb) {
    upgradeDb.createObjectStore('records',{keyPath:'pk'});
  });

  if (window.location.pathname == "/logged_in") {
    var username = document.getElementById('username').innerHTML;
    var url = "/get_record/" + username;

    fetch(url).then(function(response){
      return response.json();
    }).then(function(jsondata){
      dbPromise_record.then(function(db){
        var tx = db.transaction('records', 'readwrite');
          var recordsStore = tx.objectStore('records');
          for(var key in jsondata){
            if (jsondata.hasOwnProperty(key)) {
              recordsStore.put(jsondata[key]);
            }
          }
      });
    });
  }

  //retrive data from idb and display on page.

  if (window.location.pathname == "/post_data") {
    var post="<tr><th>Date</th><th>Primary Task</th><th>Sub Task</th><th>Start Time</th><th>End Time</th></tr>";
    dbPromise_record.then(function(db){
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
            if(cursor.value.model == "time_keeper.TimeRecord"){
              if(field=='fields'){
                recordsData=cursor.value[field];
                for(var key in recordsData){
                  //   alert(recordsData[key]);
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
          }
        return cursor.continue().then(logItems);
      });
  }
