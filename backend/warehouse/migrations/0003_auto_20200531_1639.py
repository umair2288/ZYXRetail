# Generated by Django 2.2.3 on 2020-05-31 11:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0002_auto_20200531_1625'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productbatch',
            name='date_in',
            field=models.DateTimeField(default=datetime.datetime(2020, 5, 31, 16, 39, 44, 759224)),
        ),
        migrations.AlterField(
            model_name='salespersonvehicle',
            name='date',
            field=models.DateField(default=datetime.datetime(2020, 5, 31, 16, 39, 44, 764225)),
        ),
        migrations.AlterField(
            model_name='salespersonvehicle',
            name='last_modified',
            field=models.DateTimeField(default=datetime.datetime(2020, 5, 31, 16, 39, 44, 764224)),
        ),
    ]
