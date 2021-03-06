# Generated by Django 2.2.3 on 2020-10-07 12:29

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0004_auto_20200823_1904'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportQuery',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('query', models.TextField()),
                ('last_updated', models.DateField(default=django.utils.timezone.now)),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='report_query', to='analytics.Report')),
            ],
        ),
    ]
