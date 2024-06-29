from api.models import LikedPost, Participates, Post, PostImage, User
from api.permissions import IsOwner
from api.serializers import (ForumPostSerializer, PostCreateSerializer,
                             PostEditSerializer, PostImageSerializer,
                             PostSerializer)
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class ForumPosts(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id):
        posts = Post.objects.filter(course_id=course_id).select_related('tag').select_related('created_by')
        serializer = ForumPostSerializer(posts, many=True, context={'user': request.user})
        return Response(data={'posts': serializer.data}, status=status.HTTP_201_CREATED)

class CreatePost(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id):
        post_data = {
            'title': request.data['title'],
            'text': request.data['text'],
            'tag_id': request.data['tag_id'],
            'anonymous': request.data['anonymous'],
            'course_id': course_id,
            'created_by_id': request.user.id
        }

        serializer = PostCreateSerializer(data=post_data)
        if serializer.is_valid(raise_exception=True):
            post = serializer.create(post_data)
            for code in request.data['image_codes']:
                if code:
                    PostImage.objects.create(code=code, post_id=post.id)
            send_mail(
                'New Forum Post added',
                'A new forum post has been added to a course you are in.\nContext: ' + post.text + '\nPlease navigate to 127.0.0.1:3000/course/' + str(course_id),
                'ScrumBags2024@gmail.com',
                User.objects.filter(
                    id__in=Participates.objects.filter(course_id=course_id).values_list('user_id', flat=True)
                ).values_list('email', flat=True)
            )
        if not post:
            raise ValidationError('Something went wrong, please try again.')
        return Response(data={'post': PostSerializer(post).data}, status=status.HTTP_201_CREATED)
    
class EditPost(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, post_id):
        post = get_object_or_404(Post, id=post_id)
        post_serializer = PostEditSerializer(post)
        self.check_object_permissions(request, post)

        images_serializer = PostImageSerializer(PostImage.objects.filter(id=post_id), many=True)
        return Response(
            data={
                'post': post_serializer.data,
                'images': images_serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    def put(self, request, course_id, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = PostEditSerializer(request.data)
        self.check_object_permissions(request, post)
        
        post.title = serializer.data['title']
        post.tag_id = request.data['tag_id']
        post.text = serializer.data['text']
        post.save()
        serialized_post = PostSerializer(post)

        return Response({'post': serialized_post.data}, status=status.HTTP_200_OK)

class AddPostImage(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id, post_id):
        post = get_object_or_404(Post, id=post_id, course_id=course_id)
        self.check_object_permissions(request, post)

        for code in request.data['image_codes']:
            PostImage.objects.create(code=code, post_id=post.id)
        return Response(status=status.HTTP_201_CREATED)    

class DeletePostImage(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)
    
    def delete(self, request, course_id, post_id, post_image_id):
        post = get_object_or_404(Post, id=post_id, course_id=course_id)
        self.check_object_permissions(request, post)

        post_image = PostImage.objects.get(id=post_image_id, post_id=post_id)
        post_image.delete()

        return Response(status=status.HTTP_200_OK)
    
class DeletePost(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id, post_id):
        post = get_object_or_404(Post, id=post_id)
        self.check_object_permissions(request, post)
        
        post.delete()

        return Response(status=status.HTTP_200_OK)

class LikePost(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request, course_id, post_id):
        post = LikedPost.objects.filter(user_id=request.user.id , post_id=post_id)
        if not post:
            LikedPost.objects.create(user_id=request.user.id , post_id=post_id)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)

class UnlikePost(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def delete(self, request, course_id, post_id):
        post = LikedPost.objects.get(user_id=request.user.id , post_id=post_id)
        if post:
            post.delete()
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)