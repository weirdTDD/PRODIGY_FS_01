from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)
    

class LoginView(APIView):
    def post(self,request):
        email = request.data.get("email")
        password =request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request,user) 
            return Response({"message":"Login successful"})
        return Response({"error":"invalid credentials"}, status=400)
    

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message":"Logged Out"})
