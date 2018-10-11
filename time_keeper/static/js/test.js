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
		    timestamp = today.toLocaleTimeString();
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
			$("#start_time").text(start_time.toLocaleTimeString());
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
	 	   $("#stop").hide();
  	 	   $("#submit").show();
	 	   $("#stop_time").text(end_time.toLocaleTimeString());
	 	   time_arr[i] = end_time;
	 	   i = i + 1;
	 	   end_flag = 1;
		});
		$("#reset").click(function() {
			confirm("Are you sure you want to reset?");
			location.reload();
		});


		$("#submit").click(function() {
			p_task = $("#primary_task").val();
			s_task = $("#sub_task").val();

			if (p_task == "" || s_task == "") {
				alert("Please populate tasks");
			}

			else if (start_flag == 1 && end_flag == 1) {
				p_task_text = primary_task_list[p_task].name;
				s_task_text = sub_task_list[p_task].name;
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
							primary_task: p_task_text,
							sub_task: s_task_text,
							time_length: msToTime(pause_time),
							start_time: time_arr[0].toLocaleTimeString(),
							end_time: end_time,
							pause_stamps: time_arr,
							task_date: time_arr[0].toLocaleDateString(),
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
	$("#submit").hide();

	function change_sub_task() {
		sub_list_values = [];
		sub_list_names = [];
		k = 0;
		var selected_task = document.getElementById("primary_task");
		for (i = 1; i < sub_task_list.length; i++) {
			if(sub_task_list[i].primary_task == selected_task.value) {
				sub_list_values[k] = sub_task_list[i].id;
				sub_list_names[k] = sub_task_list[i].name;
				k = k + 1;
			}
		}

		var selected_sub_task = document.getElementById("sub_task");
		selected_sub_task.length = 0;
		null_opt = document.createElement("option");
		null_opt.textContent = "Select Sub-Task";
		null_opt.value = "";
		selected_sub_task.appendChild(null_opt);


		for(i = 0; i < sub_list_names.length; i++) {
		 	var opt = sub_list_names[i];
		 	var val = sub_list_values[i];
			var el = document.createElement("option");
		    el.textContent = opt;
		    el.value = val;
			selected_sub_task.appendChild(el);
		}
	}

	var selected_task = document.getElementById('primary_task');

	change_sub_task();
	selected_task.addEventListener('input', function() {
	    change_sub_task();
	});

});

