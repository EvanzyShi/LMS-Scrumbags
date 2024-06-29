from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(
            email=clean_data['email'],
            password=clean_data['password'],
            firstname=clean_data['firstname'],
            lastname=clean_data['lastname'],
            is_staff=clean_data['is_staff']
        )
        user_obj.save()

        return user_obj
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):        
        return authenticate(username=clean_data['email'], password=clean_data['password'])
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'email', 'firstname', 'lastname', 'is_staff']