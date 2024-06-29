from api.models import QuestionResponse
from api.serializers import QuestionSerializer
from rest_framework import serializers


class CreateQuestionResponseSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField()

    class Meta:
        model = QuestionResponse
        fields = ['question_id', 'answer']

class MarkQuestionViewSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()
    class Meta:
        model = QuestionResponse
        fields = ['id', 'answer', 'marks', 'feedback', 'question']

class MarkQuestionActionSerializer(serializers.ModelSerializer):
    feedback = serializers.CharField(allow_blank=True)
    class Meta:
        model = QuestionResponse
        fields = ['id', 'marks', 'feedback']

class QuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionResponse
        fields = '__all__'