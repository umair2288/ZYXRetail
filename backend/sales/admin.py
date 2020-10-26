from django.contrib import admin
from .models import (Order , OrderLine, Receipt , Cheque , PaymentBreakdown , ReturnOrder )

# Register your models here.
admin.site.register(Order)
admin.site.register(OrderLine)
admin.site.register(Receipt)
admin.site.register(Cheque)
admin.site.register(PaymentBreakdown)
admin.site.register(ReturnOrder)
