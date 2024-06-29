from api.models import Quiz
from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers


class QuizzesSerializer(serializers.ModelSerializer):
    num_questions = serializers.SerializerMethodField()
    total_marks = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_num_questions(self, obj):
        return obj.question_set.count()
    
    def get_total_marks(self, obj):
        return obj.question_set.aggregate(Sum('marks'))['marks__sum']
    
    def get_is_active(self, obj):
        return obj.end_date > timezone.now()
    
    def get_status(self, obj):
        quiz_response = obj.quizresponse_set.filter(student_id=self.context.get('request').user.id).first()
        if quiz_response:
            return 'marked' if quiz_response.marked else 'unmarked'
        else:
            return 'not_attempted'

    class Meta:
        model = Quiz
        fields = ['id', 'name', 'num_questions', 'total_marks', 'is_active', 'start_date', 'end_date', 'status']

class CreateQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'start_date', 'end_date', 'course_id']

class QuizSerializer(serializers.ModelSerializer):
    total_marks = serializers.SerializerMethodField()

    def get_total_marks(self, obj):
        return obj.question_set.aggregate(Sum('marks'))['marks__sum']
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'start_date', 'end_date', 'total_marks']