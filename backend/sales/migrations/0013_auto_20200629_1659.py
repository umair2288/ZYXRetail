# Generated by Django 2.2.3 on 2020-06-29 11:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0012_receipt_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='returnorder',
            name='order',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='sales.Order'),
        ),
    ]
