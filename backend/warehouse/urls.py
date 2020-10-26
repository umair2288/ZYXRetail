from django.urls import path
from django.conf.urls import url
from . import views
from rest_framework import generics
from .serializers import (StockVehicleSerializer , ProductPieceSerializer , MovedToVehicleSerializer , ProductSerializer , ProductCategorySerializer,
WarehouseSerializer , SalesPersonVehicleSerializer , CreateSalesPersonVehicleSerializer , RouteSerializer , SupplierSerializer)
from .models import StockVehicle, ProductPiece , MovedToVehicle , Product , Warehouse , SalesPersonVehicle , Route , ProductCategory , Supplier


app_name = 'warehouse'

urlpatterns = [
    path('add-product-batch/', views.AddProductBatch.as_view(), name='Add Product Batch'),
    path('get-all-products/', views.GetAllProducts.as_view(), name='Get All Products'),
    path('create-product/', views.CreateProduct.as_view(), name='Create Product'), 
    path('product/<int:pk>',generics.RetrieveUpdateDestroyAPIView.as_view(queryset=Product.objects.all() , serializer_class=ProductSerializer)),
    path('product/category/', generics.ListCreateAPIView.as_view(queryset=ProductCategory.objects.all() , serializer_class=ProductCategorySerializer), name='Get All Categories'),
    path('product/category/<int:pk>', generics.RetrieveUpdateDestroyAPIView.as_view(queryset=ProductCategory.objects.all() , serializer_class=ProductCategorySerializer), name='Get All Categories'),
    path('suppliers/', generics.ListCreateAPIView.as_view(queryset=Supplier.objects.all() , serializer_class=SupplierSerializer) , name="list_suppliers"),
    path('suppliers/<int:pk>', generics.RetrieveUpdateAPIView.as_view(queryset=Supplier.objects.all() , serializer_class=SupplierSerializer) , name="retrieve_update_suppliers"),
    path('warehouses/', generics.ListCreateAPIView.as_view(queryset=Warehouse.objects.all(),serializer_class=WarehouseSerializer),name="Warehouses"),

    path('get-all-categories/', views.GetAllCategories.as_view(), name='Get All Categories'),
    path('get-all-categories/', views.GetAllCategories.as_view(), name='Get All Categories'),
    url(r'categories/(?P<pk>\d+)/edit/$', views.CategoryUpdateView.as_view(), name='Update Category'),
    url(r'products/(?P<pk>\d+)/edit/$', views.UpdateProductView.as_view(), name='Update Product'),
    url(r'categories/create/$', views.CategoryCreateView.as_view(), name='Create Category'),
    path('get-product-piece/', views.GetProductPiece.as_view(), name='Get product piece'),
    path('get-categorized-products/', views.GetCategorizedProducts.as_view(), name='Get categorized products'),
    path('get-warehouses/', views.GetWarehouses.as_view(), name='Get warehouses'),
    path('get-suppliers/', views.GetSuppliers.as_view() , name="Get All suppliers"),
    path('create-supplier/', views.CreateSupplier.as_view() , name="Create supplier"),
    path('stock-vehicles/', generics.ListCreateAPIView.as_view(queryset=StockVehicle.objects.all(),serializer_class=StockVehicleSerializer) , name="stock vehicles"),
  
    path('productpieces/', views.ListProductPieces.as_view() , name="product_piecelist"),
    path('product-pieces/<int:warehouse>', views.ProductPieceList.as_view() , name="product_piecelist"),
    path('product-pieces/vehicle/<int:vehicle>', views.ProductPieceListVehicle.as_view() , name="product_piecelist"),
    path('product-pieces/movetovehicle', 
        generics.ListCreateAPIView.as_view(queryset = MovedToVehicle.objects.all() , serializer_class=MovedToVehicleSerializer ) , 
        name= "Moved to Vehicle"),
    path('productpieces/v2/<int:pk>' , generics.RetrieveUpdateAPIView.as_view(queryset=ProductPiece.objects.all() , serializer_class = ProductPieceSerializer )),
    path('productpieces/<path:item_code>', views.GetProductPieceByItemCode.as_view()),
    path('products/', views.ListCreateProduct.as_view()) ,
    path('vehicle/unload-vehicle/', views.UnloadProductPieces.as_view() , name="Unload vehicle"),
    path('vehicle/unload-vehicle/<int:product>', views.UnloadProductPieces.as_view() , name="Unload vehicle"),
    path('warehouses/<int:pk>', generics.RetrieveUpdateDestroyAPIView.as_view(queryset=Warehouse.objects.all() , serializer_class=WarehouseSerializer)),
    path('vehicle/<int:pk>', generics.RetrieveUpdateDestroyAPIView.as_view(queryset=StockVehicle.objects.all() , serializer_class=StockVehicleSerializer)),
    path('salespersonvehicles/' , generics.ListAPIView.as_view(queryset= SalesPersonVehicle.objects.all() , serializer_class = SalesPersonVehicleSerializer)),
    path('salespersonvehicles/delete/<int:pk>' , generics.DestroyAPIView.as_view(queryset= SalesPersonVehicle.objects.all() , serializer_class = SalesPersonVehicleSerializer)),
    path('salespersonvehicle/assign/' , generics.CreateAPIView.as_view(queryset= SalesPersonVehicle.objects.all() , serializer_class = CreateSalesPersonVehicleSerializer)),  
    path('salespersonvehicles/<str:date>' , views.ListSalePersonVehicles.as_view() ),
    path('routes/', generics.ListAPIView.as_view(queryset=Route.objects.all() , serializer_class=RouteSerializer)),
    
]
    
    