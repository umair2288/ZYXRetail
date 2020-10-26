"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from restAPI import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/', include([
            path('admin/', admin.site.urls),
            path('restapi/', include('restAPI.urls'), name='restAPI'),
            path('user/', include('user.urls'), name='User'),
            path('warehouse/', include('warehouse.urls'), name='Warehouse'),
            path('sales/', include('sales.urls'), name='Sales'),
            path('instalments/', include('installment.urls'), name='Instalment'),
            path('mobile/', include('mobileapi.urls'), name='Mobile API'),
            path('hr/', include('hr.urls'), name='HR API'),
            path('analytics/', include('analytics.urls'),name="Analytics")
        ])
    )
]

if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
