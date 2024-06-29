from api.models import CommentImage
from rest_framework import serializers


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentImage
        fields = ['id', 'code']