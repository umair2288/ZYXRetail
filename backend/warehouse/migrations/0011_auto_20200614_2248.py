# Generated by Django 2.2.3 on 2020-06-14 17:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0010_auto_20200614_2240'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productbatch',
            name='date_in',
            field=models.DateTimeField(default=datetime.datetime(2020, 6, 14, 22, 48, 52, 290434)),
        ),
    ]
