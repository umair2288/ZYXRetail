# Generated by Django 2.2.3 on 2020-06-28 17:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0007_auto_20200628_2313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='returnorder',
            name='last_modified',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
    ]
