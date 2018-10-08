from django.db import models

# Create your models here.
class TimeRecord(models.Model):
	id=models.CharField(primary_key=True,max_length=100)
	local_id=models.IntegerField()
	user=models.CharField(max_length=50)
	task=models.CharField(max_length=100)
	time_length=models.CharField(max_length=100,null=True)
	start_time=models.DateTimeField()
	end_time=models.DateTimeField()
	pause_stamps=models.TextField(null=True)
	task_date=models.CharField(max_length=100)

