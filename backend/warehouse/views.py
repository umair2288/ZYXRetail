from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView ,
    CreateAPIView ,
    ListCreateAPIView 
)
from rest_framework.mixins import (
    UpdateModelMixin,

)
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination
from datetime import datetime
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework.response import Response
from .models import (ProductBatch, Product, ProductPiece , Supplier,  ProductCategory,Warehouse , MovedToVehicle , SalesPersonVehicle)
from django.core.exceptions import (ValidationError)
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from .serializers import (ProductSerializer, AddProductBatchSerializer,
ProductBatchSerializer , ProductPieceMinimalSerializer,
ProductPieceSerializer,
ProductCategorySerializer,GetProductSerializer ,CategorizedProductsSerializer , WarehouseSerializer , SupplierSerializer , SalesPersonVehicleSerializer
, ProductPieceCodeSerializer)


# Create your views here.

class AddProductBatch(APIView):
    def post(self, request):
        '''
        add mulitple products at same time
        '''
        free_issues = request.data.get("free_issues")
       
        ser = AddProductBatchSerializer(data = request.data)
        if ser.is_valid(raise_exception=True):
            batch = ser.save()
            if(free_issues):
                for free_issue in free_issues:
                    free_issue["free_issue_of"] = batch.id
                    ser = AddProductBatchSerializer(data = free_issue)
                    if ser.is_valid(raise_exception=True):
                        ser.save()         
            batch = ProductBatch.objects.get(id=batch.id)
            return Response(ProductBatchSerializer(instance=batch).data)



class GetAllProducts(APIView):

    def get(self,request):
        query = Product.objects.all()
        if not query.exists():
            response = {
               "success": False,
               "message": "No Products exists in database",
               "data": []
            }
        else:
            products = [product for product in query]
            response = {
               "success": True,
               "message": "Data Reterived Successfully",
               "data": GetProductSerializer(instance=products, many=True).data
            }

        return Response(response)

class GetCategorizedProducts(APIView):
    
    def get(self,request):

        query = ProductCategory.objects.filter(is_current=True)

        if query.exists():
            categories = [cat for cat in query]
            response = {
                "success": True,
                "message": "Data Reterived Successfully",
                "data": CategorizedProductsSerializer(instance=categories, many=True).data
            }
            return Response(response)        
        else:
           return Response({"success":False , "message":"no product categories exists"}) 


        response = {"success":True}

        return Response(response)
     


class CreateProduct(APIView):

    def post(self,request):
        serializer = ProductSerializer(data= request.data)

        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            response = {"success": True, 'data': data}
        else:
            response = {"success": False}

        return Response(response)

class UpdateProductView (RetrieveAPIView,UpdateModelMixin):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def put (self,request,*args,**kwargs):

        return self.partial_update(request,*args,**kwargs)

class GetAllCategories (ListAPIView):

    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryUpdateView (RetrieveAPIView,UpdateModelMixin):

    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    # permission_classes = [IsAuthenticated]

    def put (self,request,*args,**kwargs):

        return self.partial_update(request,*args,**kwargs)

class CategoryCreateView (CreateAPIView):

    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

    def post(self,request):

        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response(serializer.data)


class GetProductPiece(APIView): #gets the unsold products

    def post(self, request):

        if request.query_params['query_type'] == 'item_code':
            try:
                code = request.data["item_code"]
                query = ProductPiece.objects.filter(item_code=code)
                if query.exists():
                    product_piece = query.get()
                    response = {
                        "success": True,
                        "message": "Data retrieved successfully",
                        "data": ProductPieceSerializer(instance=product_piece, many=False).data}
                else:
                    response = {"success": False, "message": "no product exists in given code"}

            except KeyError:
                response = {"success": False, "message": "request does not contain Item code in body"}
        elif request.query_params['query_type'] == 'all':
            query = ProductPiece.objects.all()
        elif request.query_params['query_type'] == 'sega':
            query = ProductPiece.objects.filter(warehouse__entity='SEGA')
        elif request.query_params['query_type'] == 'royalmarketing':
            query = ProductPiece.objects.filter(warehouse__entity='ROYALMARKETING')
        else:
            return Response({"success":False, "message": "Qurey parameter missing"})
            
        if query.exists():
            product_pieces = [pp for pp in query ]
            response = {
                    "success": True,
                    "message": "Data retrieved successfully",
                    "data": ProductPieceSerializer(instance=product_pieces, many=True).data}
        else: 
            response = {"success": False, "message": "no product exists in given code"}



        return Response(response)


class GetWarehouses(APIView):

    def get(self,request):
        if request.query_params['type'] == 'royalmarketing':
            query = Warehouse.objects.filter(type__type='Royal Marketing')
        elif request.query_params['type'] == 'sega':
            query = Warehouse.objects.filter(type__type='Sega')
        elif request.query_params['type'] == 'chitfund':
            query = Warehouse.objects.filter(type__type='Chit Fund')
        else:
            return Response({"success":False , "message" : "Invalid quary parameter"})
        
        if query.exists():
            warehouses = [warehouse for warehouse in query]
            response = {"success":True,
                "message": "Data reterived successfully",
                "data" : WarehouseSerializer(instance=warehouses , many=True).data
            }
            return Response(response)
        else:
            return Response({"success":False , "message" : "No warehouses exists for Royal Marketing"})
    
            
        return Response({"success":True})


class GetSuppliers(APIView):

    def get(self, request):     
        if request.query_params['id'] == 'all':
            query = Supplier.objects.filter(is_current=True)
            suppliers = [supplier for supplier in query]
            response = {
                "success" : True,
                "message" : "Reteriving all suppliers",
                "data" : SupplierSerializer(instance=suppliers, many=True).data
            }
            return Response(response)
        else:
            id = request.query_params['id']
            query = Supplier.objects.filter(id=id)

            if query.exists() :
                supplier = query.get()
                response = {
                    "success":True,
                    "message" : "Data reterived for id " + str(id),
                    "data" : SupplierSerializer(instance=supplier).data
                }
                return Response(response)
            else:
                response = {
                    "success":False,
                    "message" : "No supplier exisit with id " + str(id)  
                }
                return Response(response)


class CreateSupplier(APIView):

    def post(self, request):
        data = request.data
        ser = SupplierSerializer(data=data)

        if ser.is_valid(raise_exception=True):
            sup = ser.save()
            response ={
                "success": True,
                "message": "Supplier created",
                "data": SupplierSerializer(instance=sup).data
            } 

            return Response(response)

        return Response({"success":False,"message":"Creating supplier failed"})


class ProductPieceList(ListAPIView):
    serializer_class = ProductPieceCodeSerializer
    # serializer_class = ProductPieceSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        search = self.request.query_params.get("search")
        warehouse = self.kwargs['warehouse']
        print(self.kwargs['warehouse'])
        queryset = ProductPiece.objects.filter(is_sold=False).filter(is_moved=False).filter(warehouse=warehouse)
        if search:
            queryset = queryset.filter(Q(batch__product__title__icontains=search) | Q(item_code__icontains=search))  

        return  queryset


class ProductPieceListVehicle(ListAPIView):
    serializer_class = ProductPieceCodeSerializer

    def get_queryset(self):
        vehicle = self.kwargs['vehicle']
        print(self.kwargs['vehicle'])
        query = MovedToVehicle.objects.filter(product_piece__is_sold=False).filter(return_date_time=None).filter(to_vehicle=vehicle)
        product_pieces = [mtv.product_piece for mtv in query]
        return product_pieces


class UnloadProductPieces(APIView):
    
    def post(self , request , product=None):
        if 'to_warehouse' in request.data and 'from_vehicle' in request.data :
            if product:
                query = MovedToVehicle.objects.filter(to_vehicle = request.data['from_vehicle']).filter(return_date_time__isnull=True).filter(product_piece_id=product)
            else:
                query = MovedToVehicle.objects.filter(to_vehicle = request.data['from_vehicle']).filter(return_date_time__isnull=True)
            if query.exists():
                for obj in query:
                    obj.return_date_time = datetime.now()
                    obj.return_warehouse_id = request.data['to_warehouse']
                    obj.save()
                    obj.product_piece.warehouse_id = request.data['to_warehouse']
                    obj.product_piece.is_moved = False
                    obj.product_piece.save()
                return Response({

                "success" : True,
                "message" : "Vehicle unloading successfull"
            })

            else:
                return Response({
                    "success" : False,
                    "message" : "Vehicle is already empty"
                })
        else:
            return Response({
                    "success" : False,
                    "message" : "bad request  request body should contain { to_warehouse : <int> , from_vehicle : <int>}"
                })





class ListSalePersonVehicles(ListAPIView):
    queryset = SalesPersonVehicle.objects.all()
    serializer_class = SalesPersonVehicleSerializer

    def list(self , request , date):
        queryset = self.get_queryset()
        serializer = SalesPersonVehicleSerializer(queryset.filter(date=date), many=True)
        return Response(serializer.data)

            

class GetProductPieceByItemCode(RetrieveAPIView):
    serializer_class = ProductPieceSerializer
    lookup_url_kwarg = 'item_code'
    lookup_field = 'item_code'

    def get_queryset(self):
        return ProductPiece.objects.filter(is_sold=False)




class ListCreateProduct(ListCreateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    
   
    def list(self,request,*args,**kwargs):
        is_deleted = request.query_params.get("deleted") 
        search = request.query_params.get("search")   
        if is_deleted=="yes" :
            queryset = self.get_queryset().filter(is_current=False)
        else:
            queryset = self.get_queryset().filter(is_current=True)
        if search:
            queryset = queryset.filter(Q(title__icontains=search)|Q(product_code__icontains=search))
        count = queryset.count()
        serializer = GetProductSerializer(instance=queryset.order_by("-id") , many=True)
        page = self.paginate_queryset(serializer.data)
        if page:
            return Response( {"count":count,"results":page})
        else:
            return Response({"count":count, "results":serializer.data})

class ListProductPieces(ListAPIView):
    serializer_class = ProductPieceMinimalSerializer
    queryset = ProductPiece.objects.all()

    def list(self,request,*args,**kwargs):
        is_sold = request.query_params.get("sold")
        search = request.query_params.get("search")
        batch = request.query_params.get("batch")
        queryset = self.get_queryset()
        if is_sold=="yes" :
            queryset = queryset.filter(is_sold=True)
        if is_sold=="no" :
            queryset = queryset.filter(is_sold=False)
        if batch:
            queryset = queryset.filter(batch__id=int(batch))
        if search:
            queryset = queryset.filter(item_code__contains=search)
        count = queryset.count()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance=queryset , many=True)
        page = self.paginate_queryset(serializer.data)
        if page:
            return Response( {"count":count,"results":page})
        else:
            return Response({"count":count, "results":serializer.data})
