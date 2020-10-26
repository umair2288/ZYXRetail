# Generated by Django 2.2.3 on 2020-08-16 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0003_payments_payslip'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_type', models.CharField(choices=[('Earning', 'EARNING'), ('Deduction', 'DEDUCTION')], max_length=10)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payslip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='hr.Payslip')),
            ],
        ),
        migrations.DeleteModel(
            name='Payments',
        ),
    ]
