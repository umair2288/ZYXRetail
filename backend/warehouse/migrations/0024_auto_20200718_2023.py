# Generated by Django 2.2.3 on 2020-07-18 14:53

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0023_auto_20200718_2021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productbatch',
            name='date_in',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
