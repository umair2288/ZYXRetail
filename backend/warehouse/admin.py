from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Product)
admin.site.register(ProductCategory)
admin.site.register(ProductPiece)
admin.site.register(ProductBatch)
admin.site.register(Warehouse)
admin.site.register(WarehouseType)
admin.site.register(VehicleType)
admin.site.register(StockVehicle)
admin.site.register(Supplier)
admin.site.register(MovedToVehicle)
admin.site.register(SalesPersonVehicle)
admin.site.register(Route)


