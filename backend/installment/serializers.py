from rest_framework import serializers
from .models import InstallmentPlan , InstallmentTerm
from sales.serializers import ( OrderSerializer, InvoiceAndCustomerNICSerializer , ReceiptSerializer)
from sales.models import Order
from datetime import datetime
from django.db import transaction
from django.core import exceptions


class InstalmentPlanSerializer(serializers.ModelSerializer):
    invoice = OrderSerializer()
    class Meta:
        model = InstallmentPlan
        fields = "__all__"




class InstalmentTermSerializer(serializers.ModelSerializer):
  
    amount_payable = serializers.SerializerMethodField()

    class Meta:
        model = InstallmentTerm
        fields = "__all__"
    
    def get_amount_payable(self, obj):
       return obj.due_amount - obj.amount_paid
       


class InstalmentPlanSerializerWithTerms(serializers.ModelSerializer):
    invoice = OrderSerializer()
    instalment_terms = serializers.SerializerMethodField()
    class Meta:
        model = InstallmentPlan
        fields = "__all__"

    def get_instalment_terms(self, obj):
        print(obj.terms)
        return InstalmentTermSerializer(instance=obj.terms , many=True).data

class InstalmentTermSerializerWithDetails(serializers.ModelSerializer):
    plan = InstalmentPlanSerializer()
    paid_receipts = serializers.SerializerMethodField()
    class Meta:
        model = InstallmentTerm
        fields = "__all__"

    def get_paid_receipts(self, obj):
        paid_receipts = obj.paid_receipts.all()
        return ReceiptSerializer(paid_receipts, many=True).data

class OverDueIntalmentTermsSerializer(serializers.ModelSerializer):
    overdue_terms = serializers.SerializerMethodField()
    invoice = InvoiceAndCustomerNICSerializer()
   # amount_payable = serializers.SerializerMethodField()

    class Meta:
        model = InstallmentPlan
        fields = '__all__'
    
    def get_overdue_terms(self, obj):
       overdue_terms = obj.terms.exclude(due_date__gte=datetime.today()).filter(is_paid=False) # will return product query set associate with this category
       response = InstalmentTermSerializer(overdue_terms, many=True).data
       return response

    # def get_amount_payable(self, obj):
    #     paid_receipts = obj.paid_receipts.all()
    #     payment = sum([paid_receipt.payment for paid_receipt in paid_receipts]) 
    #     return obj.due_amount - payment


class CancelInstalmentPlanSerializer(serializers.Serializer):

    invoice = serializers.CharField()
    balance_amount = serializers.DecimalField( max_digits=10 , decimal_places=2)
    block_customer = serializers.BooleanField()

    # def validate_balance_amount(self,attib):
    #     print(self.)
    #     raise serializers.ValidationError("Balance amount not matching")

    @transaction.atomic
    def create(self,validated_data):    
        order =  Order.objects.get(invoice_no=validated_data["invoice"])     
        customer = order.customer
        plan = order.instalment_plan
        
        terms = plan.terms.all()
        if not validated_data["balance_amount"] == sum([ term.due_amount - (term.amount_paid if term.amount_paid else 0) for term in terms ]):
            raise serializers.ValidationError("Balance Amount not matching")
      
        for term in terms:
            if not term.is_paid:
                term.is_canceled = True
                term.save()
        
        plan.status = InstallmentPlan.CANCELLED
        plan.is_closed = True
        plan.save()
        if validated_data["block_customer"]:
            customer.isBlacklisted = True
            customer.save()   
        return InstalmentPlanSerializerWithTerms(instance=plan).data
        


class CardSerializer(serializers.ModelSerializer):
    invoice_no = serializers.SerializerMethodField()
    customer_id = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_nic = serializers.SerializerMethodField()
    customer_address = serializers.SerializerMethodField()
    customer_contact_no = serializers.SerializerMethodField()
    vehicle_no =  serializers.SerializerMethodField()
    sales_person_nic = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    no_of_terms = serializers.SerializerMethodField()
    total_bill = serializers.SerializerMethodField()

    class Meta:
        model = InstallmentPlan
        fields = "__all__"

    def get_no_of_terms(self, obj):
        return obj.terms.count()


    def get_total_bill(self,obj):
        return obj.invoice.total_bill

    def get_items(self,obj):
        order_lines = obj.invoice.orderLines.all()
        return [ ol.product.item_code + "-" + ol.product.batch.product.product_code + "-" + ol.product.batch.product.title for ol in order_lines]


    def get_invoice_no(self,obj):
        return obj.invoice.invoice_no

    def get_customer_id(self,obj):
        return obj.invoice.customer.id

    def get_customer_nic(self,obj):
        return obj.invoice.customer.NIC
    
    def get_customer_name(self,obj):
        return obj.invoice.customer.contact.FirstName + " " + obj.invoice.customer.contact.LastName
    
    def get_customer_contact_no(self,obj):
        return obj.invoice.customer.contact.ContactNo

    def get_customer_address(self,obj):
        return obj.invoice.customer.contact.Address.__str__()
    
    def get_vehicle_no(self,obj):
        return obj.invoice.sales_person_vehicle.vehicle.vehicle_no
    
    def get_sales_person_nic(self, obj):
        return obj.invoice.sales_person_vehicle.sales_person.NIC