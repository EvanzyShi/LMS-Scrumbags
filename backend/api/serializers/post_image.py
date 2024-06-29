from api.models import PostImage
from rest_framework import serializers

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'code']