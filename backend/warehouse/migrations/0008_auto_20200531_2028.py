# Generated by Django 2.2.3 on 2020-05-31 14:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0007_auto_20200531_1913'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productbatch',
            name='date_in',
            field=models.DateTimeField(default=datetime.datetime(2020, 5, 31, 20, 28, 26, 393167)),
        ),
    ]
