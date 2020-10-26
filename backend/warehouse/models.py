from django.db import models
from user.models import Address
from datetime import datetime
from user.models import Contact , Employee
from django.utils import timezone
# Create your models here.


class ProductCategory(models.Model):
    title = models.CharField(max_length=50)
    LastModified = models.DateTimeField(auto_now=True)
    is_current = models.BooleanField(default= True)

    def __str__(self):
        return self.title

class Supplier(models.Model):
    business_name = models.CharField(max_length=100)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE , null=True , blank=True)
    website = models.CharField(max_length=100,null=True, blank=True)
    is_current = models.BooleanField(default=True)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name


class Product(models.Model):
    product_code = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE , related_name='products')
    LastModified = models.DateTimeField(auto_now=True)
    is_current = models.BooleanField(default=True)

    def __str__(self):
        return self.title + "-" + self.category.title


class ProductBatch(models.Model):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING , related_name="batches")
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    date_in = models.DateTimeField(default=timezone.now)
    is_free_issue = models.BooleanField(default=False)
    free_issue_of = models.ForeignKey("ProductBatch", on_delete=models.CASCADE , related_name="free_issues" ,null=True , blank=True)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class WarehouseType(models.Model):
    type = models.CharField(max_length=100)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type

class Warehouse(models.Model):
    SEGA = "SEGA"
    ROYALMARKETING = "ROYALMARKETING"
    CHITFUND = "CHITFUND"
    OTHER = "OTHER"

    ENTITY_CHOICES = [
        (SEGA , "Sega"),
        (ROYALMARKETING , "Royal Marketing"),
        (CHITFUND, "Chit Fund"), 
        (OTHER , "Other")   
    ]

    entity = models.CharField(choices=ENTITY_CHOICES, max_length=50)
    title = models.CharField(max_length=100,null=True, blank=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE , null=True , blank=True)
    capacity = models.CharField(max_length=20, null=True, blank=True)
    type = models.ForeignKey(WarehouseType, on_delete=models.CASCADE,null=True, blank=True)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)+'.' +self.title


class VehicleType(models.Model):
    title = models.CharField(max_length=100)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class StockVehicle(models.Model):

    SEGA = "SEGA"
    ROYALMARKETING = "ROYALMARKETING"
    CHITFUND = "CHITFUND"
    OTHER = "OTHER"

    ENTITY_CHOICES = [
        (SEGA , "Sega"),
        (ROYALMARKETING , "Royal Marketing"),
        (CHITFUND , "Chit Fund"),
        (OTHER , "Other")  
    ]



    vehicle_no = models.CharField(max_length=20)
    entity = models.CharField(choices=ENTITY_CHOICES, max_length=50)
    name = models.CharField(max_length=100)
    is_current = models.BooleanField(default= True)
    LastModified = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id) + '.'+self.vehicle_no


class ProductPiece(models.Model):

    item_code = models.CharField(max_length=50)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    initial_payment = models.DecimalField(max_digits=10 , decimal_places=2, default=0 )
    batch = models.ForeignKey(ProductBatch, on_delete=models.CASCADE , related_name="pieces")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.PROTECT)
    is_sold = models.BooleanField(default=False)
    is_moved = models.BooleanField(default=False)
    is_revalued = models.BooleanField(default=False)
    pre_revalued_price = models.DecimalField(max_digits=10 , decimal_places=2 ,null=True , blank=True)
    LastModified = models.DateTimeField(auto_now=True)
   
    def __str__(self):
        return str(self.id) + '.' + self.item_code + " - " + self.batch.product.title


class MovedToVehicle(models.Model):

    product_piece = models.ForeignKey(ProductPiece, on_delete=models.PROTECT, related_name = "vehicle")
    date_time = models.DateTimeField( auto_now=True)
    to_vehicle = models.ForeignKey(StockVehicle, on_delete=models.PROTECT)
    return_date_time = models.DateTimeField(null=True,blank=True)
    return_warehouse = models.ForeignKey(Warehouse , on_delete=models.DO_NOTHING , null=True , blank=True)
    LastModified = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.id) + self.product_piece.item_code
        + " moved to " + self.to_vehicle.vehicle_no
        + " from " + self.from_warehouse.title
        + " on " + self.date_time



class Route(models.Model):
    title = models.CharField(max_length=20)
    last_updated = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.id) + self.title


class SalesPersonVehicle(models.Model):
    sales_person = models.ForeignKey(to=Employee , on_delete=models.CASCADE , related_name='vehicles')
    vehicle = models.ForeignKey(to=StockVehicle , on_delete=models.CASCADE , related_name='sales_persons')
    route = models.ForeignKey(to=Route, on_delete=models.CASCADE,related_name="routes")
    driver = models.ForeignKey(to = Employee , on_delete = models.CASCADE,related_name="drivers")
    date = models.DateField(default=timezone.now)
    last_modified = models.DateTimeField(default = timezone.now)

    def __str__(self):
        return str(self.id) + '.' + str(self.date) + "-" + self.vehicle.vehicle_no + "-" + self.sales_person.Contact.FirstName


    class Meta:
        unique_together = [['sales_person' , 'vehicle' , 'driver' , 'date','route']]

