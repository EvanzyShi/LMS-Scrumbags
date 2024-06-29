from api.models.liked_post import LikedPost
from rest_framework import serializers


class LikedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikedPost
        fields = ['user_id']