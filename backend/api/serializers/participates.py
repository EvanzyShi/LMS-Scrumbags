from api.models.participates import Participates
from rest_framework import serializers


class ParticipatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participates
        fields = ['id', 'course_id', 'user_id']