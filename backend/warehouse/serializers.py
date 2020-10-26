from rest_framework import serializers
from django.db import transaction
from .models import (
    Product, 
    ProductBatch, 
    ProductPiece , 
    ProductCategory,
    Supplier,
    Contact, 
    Warehouse 
    ,StockVehicle
    ,MovedToVehicle
    ,SalesPersonVehicle
    ,Route
)




class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = "__all__"

class ProductBatchModalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBatch
        fields = "__all__"

class ProductPieceModalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPiece
        fields = "__all__"


class AddProductBatchSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    is_free_issue = serializers.BooleanField(default=False)
    free_issue_of = serializers.IntegerField(default=None , allow_null=True)
    number_of_items = serializers.IntegerField()
    supplier_id = serializers.IntegerField()
    warehouse_id = serializers.IntegerField()
    cost_price = serializers.DecimalField(max_digits=10 , decimal_places=2)
    sell_price = serializers.DecimalField(max_digits=10 , decimal_places=2)
    initial_payment = serializers.DecimalField(max_digits=10 , decimal_places=2)
    
    @transaction.atomic
    def create(self , validated_data):
        product_batch_ser = ProductBatchModalSerializer(data={
            "product" : validated_data.pop("product_id"),
            "supplier": validated_data.pop("supplier_id"),
            "is_free_issue":validated_data.pop("is_free_issue"),
            "free_issue_of": validated_data.pop("free_issue_of"),
        })
        if product_batch_ser.is_valid(raise_exception=True):
            batch = product_batch_ser.save()
            warehouse = validated_data.pop("warehouse_id")
            cost_price = validated_data.pop("cost_price")
            sell_price = validated_data.pop("sell_price")
            initial_payment = validated_data.pop("initial_payment")
            for i in range(validated_data.pop("number_of_items")):
                item_code = "BT" + str(batch.id) + "P" + str(batch.product.id) + "/" + str(i+1)
                product_piece_ser = ProductPieceModalSerializer(data={
                    "item_code" : item_code,
                    "batch" : batch.id,
                    "warehouse":warehouse,
                    "cost_price" : cost_price,
                    "sell_price" : sell_price,
                    "initial_payment": initial_payment,          
                })
                if product_piece_ser.is_valid(raise_exception=True):
                    product_piece = product_piece_ser.save()
        
            return batch
        
    
    


class StockVehicleSerializer(serializers.ModelSerializer):
    
    class Meta:
        fields = '__all__'
        model = StockVehicle


class ProductCategorySerializer(serializers.ModelSerializer):

    class Meta:
        fields = "__all__"
        model = ProductCategory


class CategorizedProductsSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = "__all__" # add relative fields

    def get_products(self, obj):
       products = obj.products.filter(is_current=True) # will return product query set associate with this category
       response = ProductSerializer(products, many=True).data
       return response


class ProductSerializer(serializers.ModelSerializer):
  
    class Meta:
        fields = "__all__"
        model = Product


         



class GetProductSerializer (serializers.ModelSerializer):

    category = ProductCategorySerializer()
    batches = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_batches(self, obj):
        batches = obj.batches.all().order_by("-date_in")
        response = ProductBatchSerializer(instance=batches , many=True).data
        return response


class ProductBatchSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    available_pieces = serializers.SerializerMethodField()
    free_issues = serializers.SerializerMethodField("get_free_issues")
    
    class Meta:
        fields = "__all__"
        model = ProductBatch

    def get_available_pieces(self, obj):
        available_pieces = obj.pieces.filter(is_sold=False).count()
        return available_pieces
    def get_sold_pieces(self,obj):
        return obj.pieces.filter(is_sold=True).count()
    
    def get_free_issues(self,obj):
        return ProductBatchSerializer(instance=obj.free_issues, many=True).data


class ProductPieceCodeSerializer(serializers.ModelSerializer):
    product_title = serializers.SerializerMethodField()
    product_code = serializers.SerializerMethodField()
    class Meta:
        fields = ("id","item_code","product_code","product_title")
        model = ProductPiece

    def get_product_code(self,obj):
        return obj.batch.product.product_code

    def get_product_title(self,obj):
        return obj.batch.product.title


class ProductPieceSerializer(serializers.ModelSerializer):
    batch = ProductBatchSerializer()
    class Meta:
        fields = "__all__"
        model = ProductPiece

class ProductPieceMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        model = ProductPiece
        depth = 1

class ProductCategorySerializer (serializers.ModelSerializer):

    class Meta :

        model = ProductCategory
        fields = '__all__'

class ContactSerializer (serializers.ModelSerializer):

    class Meta:

        model = Contact
        fields = '__all__'

class SupplierSerializer (serializers.ModelSerializer):
    class Meta:

        model = Supplier
        fields = '__all__'

class WarehouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Warehouse
        fields = '__all__'


class MovedToVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovedToVehicle
        fields = '__all__'
    
    def create(self, validated_data):
        print(validated_data)
        pp = validated_data['product_piece']
        pp.is_moved = True
        pp.save()
        return MovedToVehicle.objects.create(**validated_data)



class SalesPersonVehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalesPersonVehicle
        fields = '__all__'
        depth = 2


class CreateSalesPersonVehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalesPersonVehicle
        fields = '__all__'
       