from api.models.liked_comment import LikedComment
from rest_framework import serializers


class LikedCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikedComment
        fields = ['user_id']