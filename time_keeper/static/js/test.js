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
	var time_arr = [];
	var start_flag;
	var end_flag;

		if (navigator.onLine) {
			$("#save_link").show();
		}

		else{
			$("#save_link").hide();
		}

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

		  return hours + ":" + minutes + ":" + seconds;
		}

	    function timer() {
		  	if (flag == 1) {
		  		time_now = new Date();
		  		time_len =  time_now - start_time;
		  		$("#timer").text(msToTime(pause_time + time_len));
		  		var t = setTimeout(timer, 1000);
			}
		}


		$("#start").click(function() {
		    console.log($("#primary_task").val());
			start_time = new Date();
			flag=1;
			timer();
			$("#stop").show();
			$("#start").hide();
			time_arr[i] = start_time;
			$("#start_time").text(time_arr[0]);
			i = i + 1;
			start_flag = 1;
			end_flag = 0;
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
	 	   $("#stop_time").text(end_time);
	 	   time_arr[i] = end_time;
	 	   i = i + 1;
	 	   end_flag = 1;
		});

		$("#submit").click(function() {
			p_task = $("#primary_task").val();
			s_task = $("#sub_task").val();

			if (p_task == "" || s_task == "") {
				alert("Please populate tasks");
			}
			
			else if (start_flag == 1 && end_flag == 1) {
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
					fields: {user: $("#username").text(),
							task: $("#task").val(),
							time_length: msToTime(pause_time),
							start_time: time_arr[0],
							end_time: end_time,
							pause_stamps: time_arr,
							task_date: $("#task_date").val(),
					}
				  };
				  recordsStore.add(item);
				  return tx.complete;
				}).then(function() {
				  alert('Item has been added to the records');
				  start_flag = 0;
				  end_flag = 0;
				});
				location.reload();
			}
			else if (start_flag != 1) {
				alert("Timer has not been activated.")
			}
			else {
				alert("Timer has not been stopped.")
			}
		});

	clock();
	$("#stop").hide();
});

