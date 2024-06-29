from api.models.course import Course
from rest_framework import serializers


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'is_active', 'term', 'url']

class CourseClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['url']