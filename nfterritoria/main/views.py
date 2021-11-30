import os
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, Http404

# Create your views here.

def index(request):
    return render(request,'main/index.html')

def getting_started(request):
    return render(request,'main/getting-started.html')

def my_nft(request):
    return render(request,'main/my-nft.html')

def miners(request):
    return render(request,'main/miners.html')

def sales(request):
    return render(request,'main/sales_whitelist.html')

def launcher(request):
    #return download(request,"main/files/launcher.jar","application/java-archive")
    return render(request,'main/launcher.html')

def download_launcher(request):
    return download(request,"main/files/launcher.jar","application/java-archive")

def client(request):
    return download(request,"main/files/client.zip","application/zip")

def download(request,path,content_type):
    file_path = os.path.join(settings.MAIN_STATIC_ROOT, path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type=content_type)
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404
