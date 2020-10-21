from django.shortcuts import render
from django.http import HttpResponse
from .models import Sites

# Create your views here.


def open_homepage(request):
    return render(request,'index.html')


def open_site(request,site_url):
	#Check if the site already exists
	site = Sites.objects.filter(site_url=site_url)

	if(len(site)==0):
		#the site doesn't exist
		return render(request,'createpage.html')
	else:
		#the site already exists
		return render(request,'enterpassword.html')


def load_layout(request):
	return render(request,'textareanew.html')


def open_aboutpage(request):
	return render(request,'about.html')


def open_howitworkspage(request):
	return render(request,'how-it-works.html')


def open_reportpage(request):
	return render(request,'report.html')