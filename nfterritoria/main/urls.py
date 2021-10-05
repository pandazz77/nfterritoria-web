from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.index),
    path('index',views.index),
    path('map',views.map),
    path('getting-started',views.getting_started),
    path('my-nft',views.my_nft),
    path('miners',views.miners),
    path('sales',views.sales),
    path('launcher',views.launcher),
    path('download-launcher',views.download_launcher),
    path('client',views.client)
]