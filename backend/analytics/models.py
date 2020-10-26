from django.db import models
from django.utils import timezone

# Create your models here.



class Report(models.Model):

    title = models.CharField(max_length=100)
    link = models.CharField(max_length=200)
    filter_url = models.CharField(max_length=200)
    data_url = models.CharField(max_length=200)
    filter_param = models.CharField(max_length=50)
    value = models.CharField(max_length=50 , default="all")
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return self.title



class ReportQuery(models.Model):

    title = models.CharField(max_length=100)
    report = models.ForeignKey(Report , related_name='report_query' , on_delete=models.DO_NOTHING)
    query = models.TextField()
    last_updated = models.DateField(default=timezone.now)

    def __str__(self):
        return self.title