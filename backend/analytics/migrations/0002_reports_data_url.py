# Generated by Django 2.2.3 on 2020-08-23 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='reports',
            name='data_url',
            field=models.URLField(default=''),
            preserve_default=False,
        ),
    ]
