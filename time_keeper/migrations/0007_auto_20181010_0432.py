# Generated by Django 2.1.2 on 2018-10-10 04:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('time_keeper', '0006_auto_20181010_0422'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrimaryTask',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SubTask',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('primary_task', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='time_keeper.PrimaryTask')),
            ],
        ),
        migrations.DeleteModel(
            name='Task',
        ),
    ]
