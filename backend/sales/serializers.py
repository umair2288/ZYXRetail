from rest_framework import serializers , response

from .models import Order , OrderLine , Receipt , PaymentBreakdown ,Cheque , ReturnOrder
from warehouse.models import ProductPiece
from warehouse.serializers import ProductPieceSerializer
from warehouse.models import SalesPersonVehicle
from installment.models import InstallmentPlan , InstallmentTerm
from user.serializers import (CustomerSerializer, CustomerNICSerializer )
from django.db import models , transaction
from django.db.models import Sum
from django.core.exceptions import ObjectDoesNotExist , ValidationError
from datetime import datetime, date , timedelta
from django.utils import timezone


class ReceiptSerializer(serializers.ModelSerializer):

    class Meta:
        fields = "__all__"
        model = Receipt

class CreatePaymentSerializer(serializers.Serializer):
    invoice_no = serializers.CharField()
    date= serializers.DateTimeField()
    total_payment = serializers.DecimalField(max_digits=10 , decimal_places=2)
    discount = serializers.DecimalField(max_digits=10 , decimal_places=2)
    sales_person_vehicle_id = serializers.IntegerField()


    @transaction.atomic
    def create(self,validated_data):
        payment = validated_data.pop("total_payment")
        sales_person_vehicle_id = validated_data.pop("sales_person_vehicle_id")
        invoice_no = validated_data.pop("invoice_no")
        date = validated_data.pop("date")
        order = Order.objects.get(invoice_no=invoice_no)
        instalment_plan = order.instalment_plan
        remaining_payment = payment
        while remaining_payment != 0:     
            term = InstallmentTerm.objects.filter(plan=instalment_plan).filter(is_paid=False).order_by('id').first()
            if not term:
                raise ValueError("Payment is greater than balance to be paid")
            amount_payable = term.due_amount - term.amount_paid
            if remaining_payment >= (amount_payable) : #if total amout is greater than due of the term
                term.is_paid = True
                term.amount_paid = term.due_amount
                remaining_payment = remaining_payment - amount_payable    
            else :
                term.amount_paid = term.amount_paid + remaining_payment
                remaining_payment = 0  
            term.save()           
        ser = ReceiptSerializer(data={
                "order" : order.id,
                "sales_person_vehicle": sales_person_vehicle_id,
                "payment_type":Receipt.INSTALMENT,
                "payment":payment,
                "date" : date
            })
        if ser.is_valid(raise_exception=True):
            reciept = ser.save()  
            count_of_unpaid_terms = InstallmentTerm.objects.filter(plan=instalment_plan).filter(is_paid=False).aggregate(models.Count('id'))
            if(count_of_unpaid_terms['id__count'] == 0):
                instalment_plan.status = InstallmentPlan.COMPLETE
                instalment_plan.save
            # print(count_of_unpaid_terms)
        else:
            print("Reciept creation faied")
        return reciept


class OrderInvoiceSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = Order
        fields = ("id","invoice_no")



class OrderSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = Order
        fields = "__all__"

class ReturnOrderSerializer(serializers.ModelSerializer):

    customer = serializers.SerializerMethodField()
    order = OrderSerializer()
    product_piece = ProductPieceSerializer()

    class Meta:
        fields = "__all__"
        model = ReturnOrder

    def get_customer(self,obj):
        return { "id": obj.order.customer.id ,"NIC" :obj.order.customer.NIC }

class CreateReturnOrderSerializer(serializers.ModelSerializer):


    class Meta:
        fields = "__all__"
        model = ReturnOrder


class OrderSearchSerializer(serializers.ModelSerializer):

    customer = serializers.SerializerMethodField("get_customer")
    
     
    class Meta:
        model = Order
        fields = "__all__"
    
    def get_customer(self,obj):
        return {
            "id" :obj.customer.id,
            "NIC" : obj.customer.NIC,
            "name" : obj.customer.contact.FirstName  + " " +  obj.customer.contact.LastName
        }
    





class IntallmentTermSerializer(serializers.ModelSerializer):

    class Meta:
        fields = "__all__"
        model = InstallmentTerm




class IsSoldValidator(object):
  def __call__(self, value):
    product = ProductPiece.objects.get(pk=value)
    if(product.is_sold):
        raise serializers.ValidationError("Product with product is already sold")
    return value


class SalesOrderLineSerializerForRM(serializers.Serializer):
    product_id = serializers.IntegerField(validators=[IsSoldValidator()])
    order_id = serializers.IntegerField()

    def create(self, validated_data):
        product = ProductPiece.objects.get(pk=validated_data.pop('product_id'))
        order = Order.objects.get(pk=validated_data.pop("order_id"))
        unit_price = product.sell_price
        product.is_sold = True
        product.save()
        return OrderLine.objects.create(product=product , order=order , unit_price=unit_price , quantity=1,discount_amount=0)



class AddSaleSerializerForRM(serializers.Serializer):
    initial_payment = serializers.DecimalField(max_digits=10 , decimal_places=2)
    customer_id = serializers.IntegerField()
    guarantor_id = serializers.IntegerField(allow_null=True)
    sales_person_vehicle_id = serializers.IntegerField()
    entity = serializers.CharField()
  
    total_bill = serializers.DecimalField(max_digits=10 , decimal_places=2)
    discount = serializers.DecimalField(max_digits=10 , decimal_places=2)
    net_payment = serializers.DecimalField(max_digits=10 , decimal_places=2)
    due_per_term = serializers.DecimalField(max_digits=10 , decimal_places=2)
    date = serializers.DateTimeField(default=timezone.now)
    number_of_terms = serializers.IntegerField()
    weekday = serializers.CharField()
    product_pieces = serializers.ListField(child=serializers.IntegerField())
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    installment_type = serializers.CharField()
    invoice_no = "TEMP01"
    order_type = Order.INSTALMENT

    @transaction.atomic
    def create(self , validated_data):
        initial_payment = validated_data.pop("initial_payment")
        product_pieces = validated_data.pop("product_pieces")
        number_of_terms = validated_data.pop("number_of_terms")
       
        weekday = validated_data.pop("weekday")
        start_date = validated_data.pop("start_date")
        end_date = validated_data.pop("end_date")
        installment_type = validated_data.pop("installment_type")
        due_per_term = validated_data.pop('due_per_term')
     
        print(validated_data)
        #Create Order 
        order = Order.objects.create(**validated_data,order_type=self.order_type , invoice_no=self.invoice_no)
        order.invoice_no = "RM"+ str(order.id)
        order.save()

        #Create OrderLines
        order_line_data = [{"product_id": pp , "order_id":order.id } for pp in product_pieces]
        orderlines = SalesOrderLineSerializerForRM(data =order_line_data , many=True)
        if(orderlines.is_valid(raise_exception=True)):
            orderlines.save()

        #Create Reciepts
        receipt = Receipt.objects.create(order=order ,
            sales_person_vehicle = order.sales_person_vehicle,
            payment_type = Receipt.INITIAL_PAYMENT,
            payment = initial_payment
             )
        #Create Intallment Plan
      
        installment_plan = InstallmentPlan.objects.create(
            invoice = order ,
            initial_payment = initial_payment,
            week_day = weekday,
            start_date = start_date,
            end_date = end_date,
            status = InstallmentPlan.ONPROCESS,  
            installment_type = installment_type
        )
        
        #Installment Term Serializer
        installment_term_data = []
        if installment_plan.installment_type == InstallmentPlan.MONTHLY:
            installment_term_data = [{
                "plan": installment_plan.id,
                "title" : "Term " + str(i+1),
                "due_amount" : due_per_term,
                "due_date" : (order.date + timedelta(days=30*(i + 1))).date()
            } for i in range(number_of_terms)]

        if installment_plan.installment_type == InstallmentPlan.WEEKLY:
            installment_term_data = [ {
                "plan": installment_plan.id,
                "title" : "Term " + str(i+1),
                "due_amount" : due_per_term,
                "due_date" : (order.date + timedelta(days=7*(i + 1))).date()
            } for i in range(number_of_terms)]

        ser = IntallmentTermSerializer(data=installment_term_data , many=True)
        if(ser.is_valid(raise_exception=True)):
            ser.save()

        return order

class AddCashSaleSerializerForRM(serializers.Serializer):
    customer_id = serializers.IntegerField()
    sales_person_vehicle_id = serializers.IntegerField()
    entity = serializers.CharField()
    total_bill = serializers.DecimalField(max_digits=10 , decimal_places=2)
    discount = serializers.DecimalField(max_digits=10 , decimal_places=2)
    net_payment = serializers.DecimalField(max_digits=10 , decimal_places=2)
    date = serializers.DateTimeField(default=timezone.now())
    product_pieces = serializers.ListField(child=serializers.IntegerField())
  
 
    invoice_no = "TEMP01"
    order_type = Order.CASH

    @transaction.atomic
    def create(self , validated_data):
        product_pieces = validated_data.pop("product_pieces")    
        order = Order.objects.create(**validated_data , invoice_no=self.invoice_no , order_type=self.order_type)
        order.invoice_no = "RMCSH"+ str(order.id)
        order.save()

        #Create OrderLines
        order_line_data = [{"product_id": pp , "order_id":order.id } for pp in product_pieces]
        orderlines = SalesOrderLineSerializerForRM(data =order_line_data , many=True)
        if(orderlines.is_valid(raise_exception=True)):
            orderlines.save()

        #Create Reciepts
        receipt = Receipt.objects.create(order=order ,
            sales_person_vehicle = order.sales_person_vehicle,
            payment_type = Receipt.COMPLETE,
            payment = order.net_payment
        )

        return order



class OrderLineSerializer(serializers.ModelSerializer):
    product = ProductPieceSerializer()
    class Meta:
        model = OrderLine
        fields = "__all__"


class SaleOrderLineSerializer(serializers.ModelSerializer): 
    
    class Meta:
        model = OrderLine
        fields = '__all__'
   


class AddSaleSerializer(serializers.ModelSerializer):
    order_lines = SaleOrderLineSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
     #   exclude =("invoice_no" ,)
    
    def create(self, validated_data):
        data =  validated_data
        data['customer'] = data['customer'].id
        data['sales_person'] = data['sales_person'].id
        ser = OrderSerializer(data = data)
        if ser.is_valid(raise_exception=True):
            order = ser.save()
            

    
  
        

class GetOrderSerializer(serializers.ModelSerializer):
    order_lines = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    customer = CustomerSerializer()
    instalment_plan_id = serializers.SerializerMethodField()
     
    class Meta:
        model = Order
        fields = "__all__"
    
    def get_order_lines(self, obj):
       order_lines = obj.orderLines.all() # will return product query set associate with this category
       response = OrderLineSerializer(order_lines, many=True).data
       return response

    def get_payment_status(self, obj):
        
        try:
            return obj.instalment_plan.status
        except ObjectDoesNotExist:
            return "CASH SALE"
        # return "TEST"
        # return  obj.instalment_plan.status if obj.installment_plan else "CASH SALE"
         
        # will return product query set associate with this category
    def get_instalment_plan_id(self, obj):
        try:
            if obj.instalment_plan:
                return obj.instalment_plan.id
            else:
                return None
        except Exception:
            return None
            
      


class InvoiceAndCustomerNICSerializer(serializers.ModelSerializer):
    customer = CustomerNICSerializer()

    class Meta:
        fields = ["id","invoice_no","customer"]
        model = Order





class GetReceiptsSerializer(serializers.ModelSerializer):
    order = OrderSerializer()
    class Meta :
        fields = "__all__"
        model = Receipt


class ChequeSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        many = kwargs.pop('many', True)
        super(ChequeSerializer, self).__init__(many=many, *args, **kwargs)

    class Meta:
        model = Cheque
        fields = "__all__"


class PaymentBreakdownSerializer(serializers.ModelSerializer):

    #cheque = ChequeSerializer(allow_null=True , many=True)
    
    class Meta:
        model = PaymentBreakdown
        fields = "__all__"

    # def create(self, validated_data):
    #     print(validated_data)
    


class OrderSummarySerializer(serializers.ModelSerializer):

    initial_payment = serializers.SerializerMethodField()
    total_installment_paid = serializers.SerializerMethodField()
    total_payment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_initial_payment(self,obj):
        try:
            reciept = Receipt.objects.filter(payment_type=Receipt.INITIAL_PAYMENT).filter(order_id=obj.id).get()
        except Exception as ex:
            return "NO RECIEPTS FOUND FOR INITIAL PAYMENTS"
        return reciept.payment #Receipt.objects.filter(payment_type=Receipt.INITIAL_PAYMENT).filter(id=obj.id)
    
    def get_total_installment_paid(self,obj):
        try:
            sum = Receipt.objects.filter(payment_type=Receipt.INSTALMENT).filter(order_id=obj.id).aggregate(models.Sum("payment"))
        except Exception as ex:
            return 0
        return sum["payment__sum"]

    def get_total_payment(self, obj):
        try:
            sum = Receipt.objects.filter(order_id=obj.id).aggregate(models.Sum("payment"))
        except Exception as ex:
            return "NO PAYMENTS FOUND FOR THIS ORDER"
        return sum["payment__sum"]



class PerformActionSerializer(serializers.Serializer):
    return_order_id = serializers.IntegerField()  
    # sales_person_vehicle_id = serializers.IntegerField()
    #below fields are specific to exhange and refund
    return_order_value = serializers.DecimalField(max_digits=10 , decimal_places=2 , allow_null=True)
    new_product_piece_id = serializers.IntegerField( allow_null=True)
    number_of_terms = serializers.IntegerField(allow_null=True)
    new_due_per_term = serializers.DecimalField(max_digits=10 , decimal_places=2 , allow_null=True)
    new_start_date = serializers.DateField(allow_null=True)
    new_end_date = serializers.DateField(allow_null=True)
    
    @transaction.atomic
    def create(self,validated_data):  
        return_order = ReturnOrder.objects.get(id=validated_data["return_order_id"])      
        if return_order.action == ReturnOrder.EXCHANGE_ORDER or return_order.action == ReturnOrder.REFUND:
            #create negative reciept with product_value for current order
            current_order = return_order.order
            refund_reciept = Receipt.objects.create(
                order_id=current_order.id ,
                sales_person_vehicle_id = return_order.sales_person_vehicle.id,
                payment_type = Receipt.REFUND,
                payment = (-1 * validated_data["return_order_value"])             
                 )
            current_order.is_canceled = True
            current_order.save()
            #data for new sale
            order_lines = current_order.orderLines.exclude(product=return_order.product_piece)
            for ol in order_lines:
                ol.product.is_sold = False
                ol.product.save()
            product_pieces = [ol.product.id for ol in order_lines]        
            product_pieces =  product_pieces + [validated_data["new_product_piece_id"]] if validated_data["new_product_piece_id"] else product_pieces
           # total_value = current_order.orderLines.exclude(product=return_order.product_piece).aggregate(Sum("unit_price"))
            total_value = ProductPiece.objects.filter(id__in = product_pieces).aggregate(Sum("sell_price"))
            if total_value["sell_price__sum"]:
                ##no values for new order means no need to create new order
                order_value = total_value["sell_price__sum"] - current_order.discount   
                if order_value >= validated_data["return_order_value"] :     
                    initial_payment = validated_data["return_order_value"]  
                    cash_refund = 0
                else:
                    initial_payment = order_value  
                    cash_refund = validated_data["return_order_value"] - order_value
                new_sale_data = {
                    "initial_payment" : initial_payment,
                    "customer_id" : current_order.customer_id,
                    "guarantor_id": current_order.guarantor_id,
                    "sales_person_vehicle_id" :  return_order.sales_person_vehicle.id,
                    "total_bill" : total_value["sell_price__sum"],
                    "discount" : current_order.discount,
                    "entity" : Order.ROYALMARKETING,
                    "net_payment" : total_value["sell_price__sum"] - current_order.discount,
                    "due_per_term" : validated_data["new_due_per_term"],
                    "number_of_terms" : validated_data["number_of_terms"],
                    "weekday" : current_order.instalment_plan.week_day,
                    "product_pieces" : product_pieces,
                    "start_date" : validated_data["new_start_date"],
                    "end_date" : validated_data["new_end_date"],
                    "installment_type" : current_order.instalment_plan.installment_type
                }
                new_sale_ser = AddSaleSerializerForRM(
                    data = new_sale_data
                )
                if new_sale_ser.is_valid(raise_exception=True):
                    new_order = new_sale_ser.save()
                    new_order.parent_order = current_order
                    new_order.save()
                    return_order.is_action_performed = True
                    return_order.save()    
                    current_order.instalment_plan.status = InstallmentPlan.CANCELLED
                    current_order.instalment_plan.save()
                    return {
                        "new_order": OrderSummarySerializer(instance=new_order).data,
                        "cancelled_order": OrderSerializer(instance=current_order).data,
                        "cash_refund" : cash_refund
                    }
            else:
                cash_refund = validated_data["return_order_value"]
                return_order.is_action_performed = True
                return_order.save()    
                current_order.instalment_plan.status = InstallmentPlan.CANCELLED
                current_order.instalment_plan.save()
                return {
                    "new_order": None,
                    "cancelled_order": OrderSerializer(instance=current_order).data,
                    "cash_refund" : cash_refund
                }

          
        if return_order.action == ReturnOrder.WARRANTY_CLAIM:
            return_order.is_action_performed = True
            return_order.save()
            return {
                    "new_order": None,
                    "cancelled_order": None,
                    "cash_refund" : None
                }

      
        

class ReturnOrderBalanceSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    value = serializers.DecimalField(max_digits=10 , decimal_places=2)
    product_piece = serializers.CharField( allow_null=True)

    def create(self, validated_data):
        value = 0
        try:
            return_order = ReturnOrder.objects.get(id=validated_data["id"])
        except ObjectDoesNotExist:
            raise ValidationError("ReturnOrder not found. please check return order id")
        else :
            if validated_data['product_piece']:
                try:
                    pp = ProductPiece.objects.get(item_code = validated_data['product_piece'])
                    if pp.is_sold:
                        raise ValidationError(" Product piece {} is already sold".format(pp.item_code))
                except ObjectDoesNotExist:
                    raise ValidationError("Product Piece Does Not exsits")
                           
            value = value + validated_data["value"]
            net_payment = return_order.order.net_payment
            amount_paid = return_order.order.receipts.aggregate(Sum("payment"))["payment__sum"]

            if validated_data['product_piece']:
                return {
                    "balance_amount" : (net_payment + pp.sell_price) - (value + amount_paid),
                    "product_piece_id" : pp.id,
                    "create_new_order" : True
                }
            elif net_payment > amount_paid + value :
                return {
                    "balance_amount" : net_payment - (amount_paid + value),
                    "create_new_order" : True
                }
            else :
                return {
                    "balance_amount" : net_payment - (amount_paid + value),
                    "create_new_order" : False
                }



