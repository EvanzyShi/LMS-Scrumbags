from api.helpers.authentication_helper import *
from api.helpers.course_helper import *
from api.models.course import Course
from api.models.lesson import Lesson
from api.models.participates import Participates
from api.permissions import IsStaff
from api.serializers.course import CourseClassSerializer, CourseSerializer
from api.serializers.lesson import LessonSerializer
from api.serializers.user import UserSerializer
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class CoursesAll(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        request_id = serializer.data['id']
        return courses_helper(request_id)

class CoursesGetAll(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        courses = Course.objects
        course_serializer = CourseSerializer(courses, many=True)

        return Response(
            data={'courses': course_serializer.data},
            status=status.HTTP_200_OK
        )
    
class CoursesCompleted(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        request_id = serializer.data['id']
        return courses_helper(request_id, course_active=False)
    
class CoursesOngoing(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        request_id = serializer.data['id']
        return courses_helper(request_id, course_active=True)

class CoursesGet(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        if not Course.objects.filter(id=course_id).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        course = Course.objects.get(id=course_id)
        return Response({'course': CourseSerializer(course).data}, status=status.HTTP_200_OK)

class CoursesJoin(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        if not Course.objects.filter(id=course_id).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        if Participates.objects.filter(course_id=course_id, user_id=UserSerializer(request.user).data['id']):
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

        participates = Participates.objects.create(course_id=course_id, user_id=UserSerializer(request.user).data['id'])
        if not participates:
            raise ValidationError('Something went wrong, please try again.')

        course = Course.objects.get(id=course_id)
        return Response({'course': CourseSerializer(course).data}, status=status.HTTP_200_OK)

class CoursesCreate(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            course = serializer.create(request.data)
            lesson_obj = Lesson.objects.create(
                course=course, 
                name=course.name + ' Lecture', 
                type='lecture',
            )
            lesson_obj.save()
        if not course:
            raise ValidationError('Something went wrong, please try again.')

        participates = Participates.objects.create(course_id=course.id, user_id=request.user.id)
        if not participates:
            raise ValidationError('Something went wrong, please try again.')

        return Response(status=status.HTTP_201_CREATED)

class CoursesClass(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def put(self, request, course_id=None):
        if not Course.objects.filter(id=course_id).exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CourseClassSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            url = serializer.create(request.data)
        if not url:
            raise ValidationError('Something went wrong, please try again.')

        course = Course.objects.get(id=course_id)
        course.url = serializer.data['url']
        course.save()

        return Response({'course': CourseSerializer(course).data}, status=status.HTTP_200_OK)
        
class AllTutorials(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        if not is_participant(request, course_id):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        tutorials = Lesson.objects.filter(course=course_id, type='tutorial')
        serializer = LessonSerializer(tutorials, many=True)
        
        return Response(
            data={'tutorials': serializer.data},
            status=status.HTTP_200_OK
        )
    
class NewTutorial(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)
    
    def post(self, request, course_id=None):
        if not is_participant(request, course_id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        if not request.data['code']:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        course = Course.objects.get(id=course_id)
        
        lesson_obj = Lesson.objects.create(
            course=course, 
            name=request.data['code'], 
            type = 'tutorial'
        )
        lesson_obj.save()
        
        return Response(
            LessonSerializer(lesson_obj).data, 
            status=status.HTTP_200_OK
        )

class DeleteTutorial(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id=None, lesson_id=None):
        if not is_participant(request, course_id):
            return Response(status=status.HTTP_403_FORBIDDEN)
        if not is_valid_path(course_id, lesson_id):
            return Response(status=status.HTTP_404_NOT_FOUND)
        topics = Topic.objects.filter(lesson=lesson_id)
        for topic in topics:
            delete_topic(topic.id)
        tutorial = Lesson.objects.get(id=lesson_id)
        tutorial.delete()
        
        return Response(
            data={"message": "successfully deleted"}, 
            status=status.HTTP_200_OK
        )