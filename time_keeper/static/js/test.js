$(function() {
	var i = 0;
	var flag = 0;
	var remainingTime = 0;
	var pause_time = 0;
	var latest_key=0;
	var timestamp;
	var start_time;
	var end_time;
	var time_now;
	var time_len;
	var pause_arr = [];

		function clock() {
		    var today = new Date();
		    var h = today.getHours();
		    var m = today.getMinutes();
		    var s = today.getSeconds();
		    m = checkTime(m);
		    s = checkTime(s);
		    timestamp = h + ":" + m + ":" + s;
		    $("#clock").text(timestamp);
		    var t = setTimeout(clock, 500);
		}

		function checkTime(i) {
		    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		    return i;
		}
		

		function msToTime(duration) {
		  var milliseconds = parseInt((duration % 1000) / 100),
		    seconds = parseInt((duration / 1000) % 60),
		    minutes = parseInt((duration / (1000 * 60)) % 60),
		    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		  hours = (hours < 10) ? "0" + hours : hours;
		  minutes = (minutes < 10) ? "0" + minutes : minutes;
		  seconds = (seconds < 10) ? "0" + seconds : seconds;

		  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
		}

	    function timer() {
		  	if (flag == 1) {
		  		time_now = new Date();
		  		time_len =  time_now - start_time;
		  		$("#timer").text(msToTime(pause_time + time_len));
		  		var t = setTimeout(timer, 100);
			}
		}


		$("#start").click(function() {
			start_time = new Date();
			flag=1;
			timer();
			$("#stop").show();
			$("#start").hide();
			console.log(start_time);
			pause_arr[i] = start_time;
			i = i + 1;
		});

		$("#stop").click(function() {
			if (flag == 1) {
	      		pause_time = pause_time + time_len;
	      	}
	      	flag = 0;
			end_time = new Date();
	 	   $("#timer").text(msToTime(pause_time));
	 	   $("#start").show();
	 	   $("#stop").hide();
	 	   pause_arr[i] = end_time;
	 	   i = i + 1;
		});

		$("#submit").click(function() {
			dbPromise.then(function(db) {
			  var tx = db.transaction('records', 'readonly');
			  var recordsStore = tx.objectStore('records');
			  return recordsStore.openCursor();
			}).then(function logItems(cursor) {
			  if (!cursor) {
			    return;
			  }
			  latest_key = cursor.key;
			  console.log(cursor.value);
			  return cursor.continue().then(logItems);
			}).then(function() {
			  console.log(latest_key);
			}).then(function(){
				return dbPromise;
			}).then(function(db) {
			  var tx = db.transaction('records', 'readwrite');
			  var recordsStore = tx.objectStore('records');
			  var item = {
				model: "time_keeper.TimeRecord",
			    pk: latest_key + 1,
				fields: {user: "test", 
						task: "Test",
						time_length: msToTime(pause_time),
						start_time: start_time,
						end_time: end_time,
						pause_stamps: pause_arr,
						task_date: "test",
				}
			  };
			  recordsStore.add(item);
			  return tx.complete;
			}).then(function() {
			  console.log('added item to the records!');
			});

//			location.reload();
			});

	clock();
	$("#stop").hide();
});

