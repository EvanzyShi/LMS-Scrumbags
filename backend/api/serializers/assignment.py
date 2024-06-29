from api.models.assignment import Assignment
from django.utils import timezone
from rest_framework import serializers


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date', 'course_id']

class AssignmentLateCheckSerializer(serializers.ModelSerializer):
    is_late = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    def get_is_late(self, obj):
        return obj.due_date < timezone.now()
    
    def get_status(self, obj):
        submission = obj.submission_set.filter(student_id=self.context.get('user_id')).first()
        if submission:
            return submission.status
        else:
            return 'Not submitted'

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date', 'is_late', 'status', 'course_id']