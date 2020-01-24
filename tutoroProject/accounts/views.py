from django.shortcuts import render
from django.shortcuts import redirect
# Create your views here.
def redirect_home_view(request):
    response = redirect('/')
    return response