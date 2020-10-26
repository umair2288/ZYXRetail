from django.contrib import admin
from hr.models import Attendance , Payment , Payslip


class PayslipAdmin(admin.ModelAdmin):
    list_display = ['id','employee','from_date' ,'to_date' , 'total_earnings','total_deductions' , 'final_salary']
    readonly_fields = ('total_earnings','total_deductions' , 'final_salary')

# Register your models here.
admin.site.register(Attendance)
admin.site.register(Payment)
admin.site.register(Payslip,PayslipAdmin)

