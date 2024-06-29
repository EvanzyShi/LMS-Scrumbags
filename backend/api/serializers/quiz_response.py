from api.models import QuizResponse
from api.serializers import QuizSerializer, UserSerializer
from django.db.models import Sum
from rest_framework import serializers


class QuizResponseSerializer(serializers.ModelSerializer):
    student = UserSerializer()
    marks = serializers.SerializerMethodField()
    quiz = QuizSerializer()

    def get_marks(self, obj):
        return obj.questionresponse_set.aggregate(Sum('marks'))['marks__sum']
    
    class Meta:
        model = QuizResponse
        fields = ['id', 'submission_date', 'marks', 'quiz', 'marked', 'quiz', 'student']