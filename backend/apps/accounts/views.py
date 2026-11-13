from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request): return Response({"csrfToken":get_token(request)})
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer=RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save(); login(request,user)
        return Response({"id":user.id,"username":user.username,"email":user.email},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    user=authenticate(request,username=request.data.get("username"),password=request.data.get("password"))
    if user is None: return Response({"detail":"Invalid username or password."},status=status.HTTP_400_BAD_REQUEST)
    login(request,user)
    return Response({"id":user.id,"username":user.username,"email":user.email})
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request); return Response({"detail":"Logged out."})
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "phone_number": request.user.phone_number,
        "is_staff": request.user.is_staff
    })