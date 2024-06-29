from api.models import Tag
from api.permissions import IsStaff
from api.serializers import EditTagSerializer, TagSerializer
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class Tags(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id):
        tags = Tag.objects.filter(course_id=course_id)
        serializer = TagSerializer(tags, many=True)
        return Response({'tags': serializer.data}, status=status.HTTP_200_OK)

class CreateTag(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id):
        request.data.update({
            'course_id': course_id,
        })
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            tag = serializer.create(request.data)
        if not tag:
            raise ValidationError('Something went wrong, please try again.')
        return Response({'tag': TagSerializer(tag).data}, status=status.HTTP_201_CREATED)
    
class EditTag(APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaff)
    authentication_classes = (SessionAuthentication,)

    def put(self, request, course_id, tag_id):
        serializer = EditTagSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            tag = serializer.update(Tag.objects.get(id=tag_id), request.data)
        if not tag:
            raise ValidationError('Something went wrong, please try again.')
        return Response({'tag': TagSerializer(tag).data}, status=status.HTTP_200_OK)