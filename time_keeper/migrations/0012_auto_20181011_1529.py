# Generated by Django 2.1.2 on 2018-10-11 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('time_keeper', '0011_auto_20181011_1019'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timerecord',
            name='task_date',
            field=models.DateTimeField(),
        ),
    ]
