from django.db import models
from user.models import Customer , CustomerGroup
from sales.models import Order

# Create your models here.
class CustomerDelivery(models.Model):
    group = models.ForeignKey(CustomerGroup , on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer , on_delete=models.CASCADE)
    delivery_order = models.IntegerField()
    is_delivered = models.BooleanField(default=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return self.group.id
    

