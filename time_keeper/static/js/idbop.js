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
          if(cursor.value.model == "time_keeper.TimeRecord"){ 
            if(field=='fields'){
              recordsData=cursor.value[field];
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
        }
      return cursor.continue().then(logItems);
    });
}

  if (window.location.pathname == "/timer" || window.location.pathname == "/") {
  var primary_task_list= [];
  var sub_task_list = [];
  var list_index;
  var primary_start_index = "";
  var sub_start_index = "";

  dbPromise.then(function(db){
    var tx = db.transaction('records', 'readonly');
      var recordsStore = tx.objectStore('records');
      return recordsStore.openCursor();
  }).then(function logItems(cursor) {
      if (!cursor) {
        //if true means we are done cursoring over all records in records.
        var post = document.getElementById("primary_task").innerHTML;
        console.log(sub_task_list);
        for (var item in primary_task_list){
          post = post + '<option value=' + item + '>' + primary_task_list[item].name + '</option>';
        }
        document.getElementById("primary_task").innerHTML=post;
        return;
      }
      for (var field in cursor.value) {
          if(cursor.value.model == "time_keeper.PrimaryTask"){ 
            if(field=='fields'){
              recordsData=cursor.value[field];
              list_index = recordsData['id'];
              primary_task_list[list_index] = {};
              for(var key in recordsData){
                if(key =='name'){
                  primary_task_list[list_index].name = recordsData[key];
                }
              }
            }
          }
          if(cursor.value.model == "time_keeper.SubTask"){ 
            if(field=='fields'){
              recordsData=cursor.value[field];
              list_index = recordsData['id'];
              sub_task_list[list_index] = {};
              for(var key in recordsData){
                if(key =='name'){
                  sub_task_list[list_index].name = recordsData[key];
                }
                if(key =='primary_task'){
                  sub_task_list[list_index].primary_task = recordsData[key];
                }
              }
              //arrange object by primary task
            }
          }
        }
      return cursor.continue().then(logItems);
    });
}