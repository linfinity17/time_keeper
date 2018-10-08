from django.shortcuts import render
from django.core import serializers
from django.http import HttpResponse
import json
from . import forms 
from time_keeper import models

# Create your views here.

def base_layout(request):
	template='time_keeper/base.html'
	return render(request,template)

def getdata(request):
	results=models.TimeRecord.objects.all()
	dict_list = []
	for item in results:
		data_dict = {"model": "time_keeper.TimeRecord",
			"pk": item.local_id,
			"fields": {"user": item.user, 
					"task": item.task,
					"time_length": item.time_length,
					"start_time": str(item.start_time),
					"end_time": str(item.end_time),
					"pause_stamps": item.pause_stamps,
					"task_date": item.task_date,
					}
				}
		dict_list.append(data_dict)
	return HttpResponse(json.dumps(dict_list))

def postdata(request):
	template='time_keeper/post_data.html'
	form = forms.DataForm()
	print(request)
	if request.method == 'POST':
		form = forms.DataForm(request.POST)
		print("this was a post")
		if form.is_valid():
#			put all save code here
			print("this was posted")
			data_list = json.loads(form.cleaned_data['data'])
			existing_records = []
			for item in models.TimeRecord.objects.all():
				existing_records.append(item.local_id)
			for item in data_list:
				label = str(item["fields"]["user"]) + "_" + str(item["pk"])
				print(item["fields"])
				if item["pk"] not in existing_records:
					models.TimeRecord.objects.create(
						id = label,
						local_id = item["pk"],
						user = item["fields"]["user"],
						task = item["fields"]["task"],
						time_length = item["fields"]["time_length"],
						start_time = item["fields"]["start_time"],
						end_time = item["fields"]["end_time"],
						pause_stamps = item["fields"]["pause_stamps"],
						task_date = item["fields"]["task_date"],
						) 
			return render(request,template,{'form':form})


	return render(request,template,{'form':form})


def index(request):
	template='time_keeper/index.html'
	results=models.TimeRecord.objects.all()
	context={
		'results':results,
	}
	print(results)
	return render(request,template,context)
	