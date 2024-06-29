from api.helpers.frontend_datetime_convert import *
from api.models import Question, QuestionResponse, Quiz, QuizResponse
from api.permissions import IsStaff
from api.serializers import (AnswerSerializer,
                             CreateQuestionResponseSerializer,
                             CreateQuestionSerializer, CreateQuizSerializer,
                             MarkQuestionActionSerializer,
                             MarkQuestionViewSerializer, QuestionSerializer,
                             QuizResponseSerializer, QuizSerializer,
                             QuizzesSerializer)
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView


class Quizzes(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        quizzes = Quiz.objects.filter(course_id=course_id)
        serializer = QuizzesSerializer(quizzes, many=True, context={'request': request})
        return Response(data={'quizzes': serializer.data}, status=status.HTTP_200_OK)

class CreateQuiz(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id=None):
        quiz_data = {
            'name': request.data['name'],
            'start_date': convert(request.data['start_date']),
            'end_date': convert(request.data['end_date']),
            'course_id': course_id
        }
        quiz_serialized_data = CreateQuizSerializer(data=request.data)
        if quiz_serialized_data.is_valid(raise_exception=True):
            quiz_obj = quiz_serialized_data.create(quiz_data)
            questions_serialized_data = CreateQuestionSerializer(data=request.data['questions'], many=True)

            if questions_serialized_data.is_valid(raise_exception=True):
                for question in request.data['questions']:
                    question_obj = Question.objects.create(
                        type=question['type'],
                        text=question['text'],
                        correct_answer=question['correct_answer'],
                        marks=question['marks'],
                        quiz_id=quiz_obj.id
                    )
                    if question['answers']:
                        answers_serialized_data = AnswerSerializer(data=question['answers'], many=True)
                        if answers_serialized_data.is_valid(raise_exception=True):
                            answer_data = list()
                            for answer in question['answers']:
                                answer_data.append(
                                    {
                                        'name': answer['name'],
                                        'text': answer['text'],
                                        'question_id': question_obj.id
                                    }
                                )
                            answers_serialized_data.create(answer_data)
        
        return Response(status=status.HTTP_201_CREATED)

class QuizQuestions(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, quiz_id=None):
        quiz = Quiz.objects.get(id=quiz_id)
        quiz_serializer = QuizSerializer(quiz)

        questions = Question.objects.filter(quiz_id=quiz_id)
        questions_serializer = QuestionSerializer(questions, many=True)
        return Response(data={
                'quiz': quiz_serializer.data,
                'questions': questions_serializer.data
            },
            status=status.HTTP_200_OK
        )

class SubmitQuiz(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id=None, quiz_id=None):
        responses_serialized_data = CreateQuestionResponseSerializer(data=request.data['responses'], many=True)
        if responses_serialized_data.is_valid(raise_exception=True):
            quiz_response_obj = QuizResponse.objects.create(
                quiz_id=quiz_id,
                student_id=request.user.id
            )

            for response in request.data['responses']:
                question = Question.objects.get(id=response['question_id'])
                if question.type == 'multiple-choice':
                    QuestionResponse.objects.create(
                        answer=response['answer'],
                        question_id=question.id,
                        quiz_response_id=quiz_response_obj.id,
                        marks=question.marks if question.correct_answer == response['answer'] else 0
                    )
                else:
                    QuestionResponse.objects.create(
                        answer=response['answer'],
                        question_id=question.id,
                        quiz_response_id=quiz_response_obj.id,
                        marks=0
                    )

        return Response(status=status.HTTP_200_OK)

class QuizResponses(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, quiz_id=None):
        quiz = Quiz.objects.get(id=quiz_id, course_id=course_id)
        quiz_responses = QuizResponse.objects.filter(quiz_id=quiz_id)
        return Response(
            data={
                'quiz': QuizSerializer(quiz).data,
                'quiz_responses': QuizResponseSerializer(quiz_responses, many=True).data
            },
            status=status.HTTP_200_OK
        )
    
class MarkResponse(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, quiz_id=None, quiz_response_id=None):
        quiz_response = QuizResponse.objects.get(id=quiz_response_id, quiz_id=quiz_id)
        question_responses = QuestionResponse.objects.filter(quiz_response_id=quiz_response_id)
        return Response(
            data={
                'quiz_response': QuizResponseSerializer(quiz_response).data,
                'question_responses': MarkQuestionViewSerializer(question_responses, many=True).data
            },
            status=status.HTTP_200_OK
        )
    
    def post(self, request, course_id=None, quiz_id=None, quiz_response_id=None):
        responses_serializer = MarkQuestionActionSerializer(data=request.data['question_responses'], many=True)
        if responses_serializer.is_valid(raise_exception=True):
            quiz_response_obj = QuizResponse.objects.get(id=quiz_response_id, quiz_id=quiz_id)
            for question_response in request.data['question_responses']:
                question_response_obj = QuestionResponse.objects.get(id=question_response['id'])
                question_response_obj.marks = question_response['marks']
                question_response_obj.feedback = question_response['feedback']
                question_response_obj.save()

            quiz_response_obj.marked = True
            quiz_response_obj.save()

        return Response(
            status=status.HTTP_201_CREATED
        )

class QuizFeedback(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, quiz_id=None):
        quiz_result = QuizResponse.objects.get(quiz_id=quiz_id, student_id=request.user.id, marked=True)
        question_responses = QuestionResponse.objects.filter(quiz_response_id=quiz_result.id)
        return Response(
            data={
                'quiz_response': QuizResponseSerializer(quiz_result).data,
                'question_responses': MarkQuestionViewSerializer(question_responses, many=True).data
            },
            status=status.HTTP_200_OK
        )