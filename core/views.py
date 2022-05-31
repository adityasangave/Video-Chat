from django.shortcuts import render

# Create your views here.
def homepage_view(request):
    return render(request, "core/homepage.html");

def room_view(request):
    return render(request, "core/room.html");