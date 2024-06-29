from api.models.submission import Submission
from api.serializers import UserSerializer
from rest_framework import serializers


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'student', 'assignment', 'submission_date', 'status', 'grade', 'feedback']

class SubmissionDataSerializer(serializers.ModelSerializer):
    student = UserSerializer()
    is_late = serializers.SerializerMethodField()
    
    def get_is_late(self, obj):
        return obj.assignment.due_date < obj.submission_date
    
    class Meta:
        model = Submission
        fields = ['id', 'status', 'grade', 'submission_date', 'feedback', 'is_late', 'student']