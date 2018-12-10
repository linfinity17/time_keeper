  //Open new IndexedDB conncetion.

  var dbPromise_task = idb.open('task-db', 5, function(upgradeDb) {
    upgradeDb.createObjectStore('tasks',{keyPath:'pk'});
  });

  //collect latest post from server and store in idb.
  fetch('/get_task').then(function(response){
    return response.json();
  }).then(function(jsondata){
    dbPromise_task.then(function(db){
      var tx = db.transaction('tasks', 'readwrite');
        var tasksStore = tx.objectStore('tasks');
        for(var key in jsondata){
          if (jsondata.hasOwnProperty(key)) {
            tasksStore.put(jsondata[key]);
          }
        }
    });
  });


/* This section populates the primary and sub task lists */

  if ((window.location.pathname == "/timer" || window.location.pathname == "/" || window.location.pathname == "/login") && Boolean(document.getElementById("primary_task"))) {
    var primary_task_list= [];
    var sub_task_list = [];
    var list_index;
    var primary_start_index = "";
    var sub_start_index = "";

    dbPromise_task.then(function(db){
      var tx = db.transaction('tasks', 'readonly');
        var tasksStore = tx.objectStore('tasks');
        return tasksStore.openCursor();
    }).then(function logItems(cursor) {
        if (!cursor) {
          //if true means we are done cursoring over all records in records.
          var post = document.getElementById("primary_task").innerHTML;
          for (var item in primary_task_list){
            post = post + '<option value=' + item + '>' + primary_task_list[item].name + '</option>';
          }
          document.getElementById("primary_task").innerHTML=post;
          return;
        }

        for (var field in cursor.value) {
            if(cursor.value.model == "time_keeper.PrimaryTask"){
              if(field=='fields'){
                tasksData=cursor.value[field];
                list_index = tasksData['id'];
                primary_task_list[list_index] = {};
                for(var key in tasksData){
                  if(key =='name'){
                    primary_task_list[list_index].name = tasksData[key];
                  }
                }
              }
            }
            if(cursor.value.model == "time_keeper.SubTask"){
              if(field=='fields'){
                tasksData=cursor.value[field];
                list_index = tasksData['id'];
                sub_task_list[list_index] = {};
                for(var key in tasksData){
                  if(key =='name'){
                    sub_task_list[list_index].name = tasksData[key];
                  }
                  if(key =='primary_task'){
                    sub_task_list[list_index].primary_task = tasksData[key];
                  }
                }
                //arrange object by primary task
              }
            }
          }
        return cursor.continue().then(logItems);
      });
  }