from rest_framework import serializers
from warehouse import models as warehouse_models
from sales import models as sales_models
from .models import Report


class CategoryFilterSerializer(serializers.ModelSerializer):

    class Meta:
        model = warehouse_models.ProductCategory
        fields = ("id" , "title")

class VehicleFilterSerializer(serializers.ModelSerializer):
    
    title = serializers.CharField(source="name")

    class Meta:
        model = warehouse_models.StockVehicle
        fields = ("id","title")

class WarehouseFilterSerializer(serializers.ModelSerializer):
    # title = serializers.CharField(source="name")
    class Meta:
        model = warehouse_models.Warehouse
        fields = ("id","title")



class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"



class SalesSummerySerializer(serializers.Serializer):
    sales_person_id = serializers.IntegerField()
    total = serializers.DecimalField(max_digits=20 , decimal_places=2)


class CurrentStockReportSerializer(serializers.ModelSerializer):

    warehouse = serializers.SerializerMethodField(method_name="get_warehouse" ) 
    product = serializers.SerializerMethodField("get_product")
    date_in = serializers.SerializerMethodField("get_date_in")

    class Meta:
        model=warehouse_models.ProductPiece
        exclude = ("batch","LastModified" , "is_sold" , "is_moved" , "is_revalued" , "pre_revalued_price")
       
    def get_warehouse(self , obj):
        return obj.warehouse.title
    
    def get_product(self, obj):
        return obj.batch.product.title

    def get_date_in(self, obj):
        return obj.batch.date_in.date()
    
    def get_time_in(self, obj):
        return obj.batch.date_in.time()



class SalesSerializer(serializers.ModelSerializer):

    vehicle = serializers.SerializerMethodField()
    sales_person = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()
    customer = serializers.SerializerMethodField()


    class Meta:
        model = sales_models.Order
        fields = "__all__"

    def get_vehicle(self,obj):
        return obj.sales_person_vehicle.vehicle.vehicle_no
    def get_sales_person(self,obj):
        return obj.sales_person_vehicle.sales_person.NIC + "-" + obj.sales_person_vehicle.sales_person.Contact.FirstName 
    def get_driver(self,obj):
        return obj.sales_person_vehicle.driver.NIC + "-" + obj.sales_person_vehicle.driver.Contact.FirstName 
    def get_customer(self,obj):
        return obj.customer.NIC



class ProductVehicleStockSerializer(serializers.ModelSerializer):

    class Meta:
        model = warehouse_models.MovedToVehicle
        fields = "__all__"


