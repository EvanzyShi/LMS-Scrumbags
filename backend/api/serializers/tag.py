from api.models import Tag
from rest_framework import serializers


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'colour', 'course_id']

class EditTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name', 'colour']
