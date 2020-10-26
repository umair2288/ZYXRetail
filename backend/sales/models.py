from django.db import models
from django.utils import timezone
from warehouse.models import ProductPiece , SalesPersonVehicle
from user.models import Customer , Employee , CustomerGroup
from datetime import date , datetime





# Create your models here.

class Order(models.Model):


    INSTALMENT = "INSTALMENT"
    CASH = "CASH"
    ORDER_TYPE_CHOICES = [
        (INSTALMENT, "Instalment"),
        (CASH, "CASH")
    ] 

    ROYALMARKETING = 'ROYALMARKETING'
    CHIT_FUND = 'CHITFUND'
    SEGA = 'SEGA'
    ENTITY_CHOICES = [
        (ROYALMARKETING, "Royal Marketing"),
        (CHIT_FUND, "Chit Fund"),
        (SEGA, "Sega"),
    ]
    invoice_no = models.CharField(max_length=50 , unique=True)
    customer = models.ForeignKey(Customer, on_delete= models.DO_NOTHING  , related_name='orders')
    guarantor = models.ForeignKey(Customer , on_delete = models.DO_NOTHING , related_name= "guarantor_of" , null=True , blank=True)
    customer_group = models.ForeignKey(CustomerGroup , on_delete=models.DO_NOTHING , related_name="group_orders" , null=True , blank=True)
    date = models.DateTimeField(default=datetime.now)
    entity = models.CharField(max_length=50, choices=ENTITY_CHOICES ) #cash , installment, chit_fund
    sales_person = models.ForeignKey(Employee, on_delete=models.DO_NOTHING , related_name='orders' , null=True , blank=True)
    sales_person_vehicle = models.ForeignKey(SalesPersonVehicle , on_delete = models.PROTECT , related_name="orders" , null=True , blank=True)
    order_type = models.CharField(max_length=50 , choices=ORDER_TYPE_CHOICES , blank=True , null=True)
    total_bill = models.DecimalField(max_digits=10,decimal_places=2 )
    discount = models.DecimalField(max_digits=10,decimal_places=2 , default=0.0)
    net_payment =  models.DecimalField(max_digits=10,decimal_places=2 )
    # parent_order = models.ForeignKey(to="self" , on_delete=models.CASCADE , null=True , blank=True , related_name="child_order")
    is_canceled = models.BooleanField(default=False)
    last_modified = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.id) + self.invoice_no


#this table should by filled when the sales happens
class OrderLine(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="orderLines")
    product = models.ForeignKey(ProductPiece, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.IntegerField()
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    last_modified = models.DateField(auto_now=True)

from installment.models import InstallmentTerm

class Receipt(models.Model):

    INSTALMENT = "INSTALMENT"
    INITIAL_PAYMENT = "INITIAL"
    COMPLETE = "COMPLETE"
    REFUND = "REFUND"
    PAYMENT_CHOICES = [
        (INSTALMENT,"Instalment"),
        (INITIAL_PAYMENT,"Intial Payment"),
        (COMPLETE,"Complete Payment"),
        (REFUND , "Refund")
    ]
    
    order = models.ForeignKey( Order , on_delete=models.CASCADE, null=True , related_name="receipts" )
    instalment_term = models.ForeignKey(to=InstallmentTerm, on_delete= models.CASCADE ,null=True, blank=True , related_name="paid_receipts")
    sales_person = models.ForeignKey(Employee, on_delete=models.PROTECT ,related_name = 'receipts' , blank=True , null=True )
    sales_person_vehicle = models.ForeignKey(SalesPersonVehicle, on_delete=models.PROTECT ,related_name = 'receipts' , blank=True , null=True )
    payment_type = models.CharField(max_length=50, choices=PAYMENT_CHOICES)
    payment = models.DecimalField(max_digits=10,decimal_places=2)
    date = models.DateTimeField(default = timezone.now )

    def __str__(self):
        return str(self.date) + '-' + str(self.payment_type) + '-' + str(self.payment)

class PaymentBreakdown(models.Model):

    CASH = "CASH"
    CHEQUE = "CHEQUE"
    

    METHOD_CHOICES = [
        (CASH,"Cash"),
        (CHEQUE,"Cheque") 
    ]

    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE , related_name='payment_breakdown')
    method = models.CharField(choices=METHOD_CHOICES , max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    last_modified = models.DateTimeField(default = timezone.now)


class Cheque(models.Model):

    payment_breakdown = models.ForeignKey(PaymentBreakdown , on_delete=models.CASCADE , related_name= 'cheque' )
    cheque_no = models.CharField(max_length=20)
    bank = models.CharField(max_length = 300)
    deposit_date = models.DateField() 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    last_modified = models.DateTimeField(default=timezone.now)


class ReturnOrder(models.Model):

    WARRANTY_CLAIM = "WARRANTY CLAIM"
    EXCHANGE_ORDER = "EXCHANGE ORDER"
    REFUND = "REFUND"

    RETURN_ORDER_ACTION_CHOICES = [
        (WARRANTY_CLAIM , 'Warranty Claim'),
        (EXCHANGE_ORDER , 'Exchange Order'),
        (REFUND , 'Refund'),
    ]


    order = models.ForeignKey(to=Order , on_delete=models.CASCADE)
    product_piece = models.ForeignKey(ProductPiece , on_delete=models.CASCADE)
    return_order_type = models.CharField(max_length=100)
    return_order_desc = models.CharField(max_length=1000)
    date = models.DateTimeField(default = timezone.now , null=True , blank=True)
    action = models.CharField(choices=RETURN_ORDER_ACTION_CHOICES , max_length=20  , null=True , blank=True)
    is_action_performed = models.BooleanField(default=False , null=True , blank=True)
    sales_person_vehicle = models.ForeignKey(to=SalesPersonVehicle , null=True , blank=True , on_delete = models.CASCADE)
    is_revalued = models.BooleanField(default=False)
    last_modified = models.DateTimeField(default = timezone.now , null=True , blank=True)

   

