from django.contrib import admin
from .models import (InstallmentPlan, InstallmentTerm)

# Register your models here.
admin.site.register(InstallmentPlan)
admin.site.register(InstallmentTerm)