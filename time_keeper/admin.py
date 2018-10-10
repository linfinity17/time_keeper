from django.contrib import admin
from time_keeper.models import TimeRecord,PrimaryTask, SubTask

# Register your models here.

admin.site.register(TimeRecord)
admin.site.register(PrimaryTask)
admin.site.register(SubTask)