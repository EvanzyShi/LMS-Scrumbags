from api.models import Question
from api.serializers import AnswerSerializer
from rest_framework import serializers


class CreateQuestionSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Question
        fields = ['id', 'type', 'text', 'correct_answer', 'marks', 'quiz_id']

class QuestionSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    def get_answers(self, obj):
        return AnswerSerializer(obj.answer_set.all(), many=True).data
    class Meta:
        model = Question
        fields = ['id', 'type', 'text', 'marks', 'answers', 'correct_answer']