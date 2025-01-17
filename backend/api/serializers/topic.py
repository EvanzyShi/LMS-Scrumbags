from api.models.topic import Topic
from rest_framework import serializers


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'week', 'name', 'lesson', 'recording']