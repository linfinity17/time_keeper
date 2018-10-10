from django.shortcuts import render
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from . import forms 
from time_keeper import models
import json

# Create your views here.

def redir(request):
	return HttpResponseRedirect(reverse('login_page'))

def success(request):
	template='time_keeper/success.html'
	return render(request,template)

def login_page(request):
	template='time_keeper/login.html'
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request,user)
			return HttpResponseRedirect(reverse('success'))
		else:
			message = "Incorrect credentials"
			return render(request,template,{"message":message})
	return render(request,template)

@login_required(login_url="/login")
def base_layout(request):
	template='time_keeper/index.html'
	return render(request,template)

def getdata(request):
	user_logged = request.user
	results=models.TimeRecord.objects.filter(user=user_logged)
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
	if request.method == 'POST':
		form = forms.DataForm(request.POST)
		if form.is_valid():
#			put all save code here
			data_list = json.loads(form.cleaned_data['data'])
			existing_records = []
			for item in models.TimeRecord.objects.all():
				existing_records.append(item.id)
			for item in data_list:
				label = str(item["fields"]["user"]) + "_" + str(item["pk"])
				if label not in existing_records:
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

@login_required(login_url="/login")
def index(request):
	template='time_keeper/index.html'
	user = request.user
	return render(request,template,{"user":user})
