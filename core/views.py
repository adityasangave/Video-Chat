import random
import time
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder

def generateToken(request):
    appID = "fba883be51524f7ca7dc32812b446325"
    appCertificate = "5023805a4aaa4b8d88dc55a7e1f9c750"  
    channelName = request.GET.get("channel")
    uid = 0
    role = 1
    privilegeExpiredTs = 3600 * 24 + time.time()
    
    token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs)
    print(token)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)

def homepage_view(request):
    return render(request, "core/homepage.html");

def room_view(request):
    return render(request, "core/room.html");