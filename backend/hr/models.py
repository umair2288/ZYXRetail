from django.db import models
from user.models import Employee

# Create your models here.


class Attendance(models.Model):

    CHECK_IN = "CHECKIN"
    CHECK_OUT= "CHECKOUT"
    attendance_choices = ((CHECK_IN , "Check-in"), (CHECK_OUT,"Check-out"))

    employee = models.ForeignKey(to=Employee,on_delete=models.DO_NOTHING)
    attendance_type = models.CharField(choices=attendance_choices , max_length=20)
    time = models.DateTimeField()

    def __str__(self):
        return str(self.time)


class Payslip(models.Model):

    employee = models.ForeignKey(to=Employee , on_delete= models.DO_NOTHING)
    from_date = models.DateField()
    to_date = models.DateField()

    @property
    def total_earnings(self):   
        return self.payments.filter(payment_type=Payment.EARNING).aggregate(models.Sum('amount'))["amount__sum"]
    
    @property
    def total_deductions(self):   
        return self.payments.filter(payment_type=Payment.DEDUCTION).aggregate(models.Sum('amount'))["amount__sum"]
    
    @property
    def final_salary(self):
        return float(self.total_earnings or 0) - float(self.total_deductions or 0)

    def __str__(self):
        return str(self.employee.id) + "-" + str(self.from_date) + "-" + str(self.to_date)


class Payment(models.Model):
    
    EARNING = "EARNING"
    DEDUCTION = "DEDUCTION"

    payment_type_choices = ((EARNING,"Earning") , (DEDUCTION,"Deduction"))
    
    payment_type = models.CharField(max_length=10 , choices=payment_type_choices )
    payslip = models.ForeignKey(to=Payslip , on_delete=models.CASCADE , related_name="payments")
    amount = models.DecimalField(max_digits=10 , decimal_places=2)
    description = models.CharField(max_length=200 , null=True , blank=True)

    def __str__(self):
        return self.payment_type + "-" + str(self.amount)

