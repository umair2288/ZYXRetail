# Generated by Django 2.2.3 on 2020-05-28 08:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sales', '0001_initial'),
        ('installment', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='installmentplan',
            name='invoice',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='instalment_plan', to='sales.Order'),
        ),
    ]
