# Generated by Django 2.2.3 on 2020-06-15 05:57

import datetime
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0012_merge_20200615_1030'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productbatch',
            name='date_in',
            field=models.DateTimeField(default=datetime.datetime(2020, 6, 15, 11, 27, 33, 292095)),
        ),
        migrations.AlterField(
            model_name='salespersonvehicle',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='salespersonvehicle',
            name='last_modified',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
