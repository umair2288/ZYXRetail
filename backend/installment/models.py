from django.db import models
from sales.models import Order
from django.utils import timezone

# Create your models here.


class InstallmentPlan(models.Model):

    WEEKLY = 'WEEKLY'
    MONTHLY = 'MONTHLY'
  
    MONDAY = "MONDAY"
    TUESDAY = "TUESDAY"
    WENDSDAY = "WENDSDAY"
    THURSDAY = "THURSDAY"
    FRIDAY = "FRIDAY"
    SATURDAY = "SATURDAY"
    SUNDAY = "SUNDAY"


    OVER_DUE = "OVERDUE"
    COMPLETE = "COMPLETE"
    CANCELLED = "CANCELLED"
    ONPROCESS = "ONPROCESS"

   

    INSTALLMENT_STATUS = [
        (OVER_DUE , "Over Due"),
        (COMPLETE , "Complete"),
        (ONPROCESS , "On Process"),
        (CANCELLED , "Cancelled")
    ]


    WEEK_DAY = [
        (MONDAY , "Moday"),
        (TUESDAY , "Tuesday"),
        (WENDSDAY , "Wendsday"),
        (THURSDAY , "Thursday"),
        (FRIDAY, "Friday"),
        (SATURDAY , "Saturday"),
        (SUNDAY , "Sunday")
    ]

    INSTALLMENT_TYPE = [
        (WEEKLY, "Weekly"),
        (MONTHLY, "Monthly"),
     
    ]

    invoice = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="instalment_plan")
    initial_payment = models.DecimalField(max_digits=10,decimal_places=2)
    week_day = models.CharField(choices=WEEK_DAY , max_length=10)
    start_date = models.DateField(null=True , blank=True)
    end_date = models.DateField(null=True , blank=True)
    status = models.CharField(choices=INSTALLMENT_STATUS , max_length=10  , null=True , blank=True)
    no_of_terms = models.IntegerField(null=True)
    installment_type = models.CharField(max_length=10, choices=INSTALLMENT_TYPE, default=WEEKLY)
    is_closed = models.BooleanField(default=False)
    last_modified = models.DateField(default=timezone.now)



class InstallmentTerm(models.Model):
    plan = models.ForeignKey(InstallmentPlan, on_delete=models.CASCADE , related_name="terms")
    title = models.CharField(max_length=50, null=True , blank=True)
    due_amount = models.DecimalField(max_digits= 10 , decimal_places=2)
    amount_paid = models.DecimalField(max_digits= 10 , decimal_places=2 , default=0.0) 
    due_date = models.DateField()
    is_paid  = models.BooleanField(default=False)
    is_canceled = models.BooleanField(default=False)
    last_modified = models.DateField(default=timezone.now)

