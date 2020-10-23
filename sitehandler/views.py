from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Sites
from django.views.decorators.csrf import csrf_exempt



def open_homepage(request):
    return render(request,'index.html')


def open_site(request,site_url):
	site = Sites.objects.filter(site_url=site_url)

	if(len(site)==0):
		return render(request,'createpage.html')
	else:
		return render(request,'enterpassword.html')


def load_layout(request):
	return render(request,'textareanew.html')

@csrf_exempt
def save_site(request):
	CURRENT_VERSION = 2
	site_url = request.POST['site_url']
	cipher = request.POST['cipher']
	initHash = request.POST['initHash']
	newHash = request.POST['newHash']

	siteExists = check_site(site_url)

	if(siteExists==False):
		if(cipher!=""):
			site = Sites(site_url = site_url, cipher = cipher, hashcontent=initHash)
			site.save()

			return JsonResponse({"status":"success"})
		else:
			return JsonResponse({"status":"deleted"})


	else:
		hashContent = siteExists[0].hashcontent
		if(initHash==hashContent):
			if(cipher!=""):
				siteExists[0].cipher = cipher
				siteExists[0].hashcontent = newHash
				siteExists[0].save()
				return JsonResponse({"status":"success"})
			else:
				siteExists[0].delete()
				return JsonResponse({"status":"deleted"})
		else:
			return JsonResponse({"status":"fail"})



def check_site(site_url):
	site = Sites.objects.filter(site_url=site_url)

	if(len(site)==0):
		return False
	else:
		return site

def open_aboutpage(request):
	return render(request,'about.html')


def open_howitworkspage(request):
	return render(request,'how-it-works.html')


def open_reportpage(request):
	return render(request,'report.html')