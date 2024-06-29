import copy

from api.helpers.authentication_helper import *
from api.helpers.course_helper import delete_topic
from api.helpers.file_helper import *
from api.models.file import File
from api.models.lesson import Lesson
from api.models.topic import Topic
from api.models.user import User
from api.serializers.participates import ParticipatesSerializer
from api.serializers.topic import TopicSerializer
from api.serializers.user import UserSerializer
from django.core.mail import send_mail
from django.shortcuts import redirect
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView


class LectureResources(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        lecture = Lesson.objects.get(course=course_id, type='lecture')
        return redirect(f'/course/{course_id}/lesson/{lecture.id}/resources')
    
class Resources(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, lesson_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id):
            return Response(
                "Invalid course/lesson/file path",
                status=status.HTTP_404_NOT_FOUND
            )
        topics = Topic.objects.filter(lesson=lesson_id)
        topics_serializer = TopicSerializer(topics, many=True)
        unordered_data = copy.deepcopy(topics_serializer.data)

        for topic in unordered_data:
            file_ids = []
            files = File.objects.filter(reference_id=topic['id'], folder='topic')
            for file in files:
                file_ids.append((file.id, file.filename))
            topic['files'] = file_ids
        
        sorted_data = sorted(unordered_data, key=lambda d: (d['week'], d['id']))
        
        weeks = {}
        for topic in sorted_data:
            week = topic.pop("week")
            topic.pop("lesson")
            if not week in weeks.keys():
                weeks[week] = []
            weeks[week].append(topic)
        
        return Response(
            data={'lesson_id': lesson_id, 'weeks': weeks},
            status=status.HTTP_200_OK
        )

class TopicNew(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id=None, lesson_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        lesson = Lesson.objects.get(id=lesson_id)
        topic = Topic.objects.create(
            week=request.data['week'], 
            name=request.data['topic'], 
            lesson=lesson,
        )
        if 'recording' in request.data.keys():
            topic.recording=request.data['recording']
        
        topic.save()
        return Response(
                TopicSerializer(topic).data,
                status=status.HTTP_200_OK
            )

class TopicUpdate(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, lesson_id=None, topic_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        topic = Topic.objects.get(id=topic_id)

        return Response(
            TopicSerializer(topic).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, course_id=None, lesson_id=None, topic_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        topic = Topic.objects.get(id=topic_id)
        topic.week = request.data['week']
        topic.name = request.data['topic']
        if 'recording' in request.data.keys():
            topic.recording = request.data['recording']
        topic.save()
        
        return Response(
                TopicSerializer(topic).data,
                status=status.HTTP_200_OK
            )

class ResourcesFileUpload(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id=None, lesson_id=None, topic_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserSerializer(request.user)
        user_id = serializer.data['id']

        files = request.FILES.getlist('files')
        filenames = []
        for file in files:
            file_obj = file_upload(file, user_id, 'topic', topic_id)
            filenames.append(file_obj.filename)

        if filenames:
            context = "New course material has been added to a course you are in. with id" + str(course_id) + "\nPlease navigate to 127.0.0.1:3000/course to see your new material."
            send_list = []
            participates = ParticipatesSerializer(Participates.objects.filter(course_id=course_id), many=True)
            for participant in participates.data:
                email = User.objects.get(id=participant['user_id']).email
                send_list.append(email)
            send_mail(
                "New Course Material Posted",
                context,
                "ScrumBags2024@gmail.com",
                User.objects.filter(
                    id__in=Participates.objects.filter(course_id=course_id).values_list('user_id', flat=True)
                ).values_list('email', flat=True)
            )
            return Response(
                {'success': True, 'message': 'File has been uploaded',},
                status=status.HTTP_200_OK
            )
        return Response(
            {'message': 'File failed to be uploaded'},
            status=status.HTTP_400_BAD_REQUEST
        )

class ResourcesFileDownload(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, course_id=None, lesson_id=None, topic_id=None, file_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id, file_id=file_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        return file_download(file, 'resource_attachment')

class DeleteTopic(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id=None, lesson_id=None, topic_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        delete_topic(topic_id)
        return Response(
            {'success': True, 'message': 'Topic has been deleted',},
            status=status.HTTP_200_OK
        )
    
class DeleteFile(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id=None, lesson_id=None, topic_id=None, file_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, lesson_id=lesson_id, topic_id=topic_id, file_id=file_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        delete_file(file)
        return Response(
            {'success': True, 'message': 'File has been deleted',},
            status=status.HTTP_200_OK
        )

class SearchResources(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        if not is_participant(request, course_id):
            return Response(status=status.HTTP_403_FORBIDDEN)
        lesson_ids = list(Lesson.objects.filter(course=course_id).values_list('id', flat=True))
        topics = Topic.objects.filter(lesson__in=lesson_ids, name__icontains=request.GET.get('search', ''))
        response_data = {}
        for topic in topics:
            topic_files = File.objects.filter(reference_id=topic.id, folder='topic')
            response_data[topic.name] = FileUploadSerializer(topic_files, many=True).data

        return Response(
            response_data,
            status=status.HTTP_200_OK
        )

class FileDownload(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, file_id=None):
        file = File.objects.get(id=file_id)
        topic = Topic.objects.get(id=file.reference_id)
        return redirect(f'/course/{course_id}/lesson/{topic.lesson.id}/resources/{topic.id}/{file_id}/download')