from api.models import Comment, CommentImage, LikedComment, Post
from api.permissions import IsOwner
from api.serializers import (CommentImageSerializer, CommentSerializer,
                             ForumPostSerializer, PostCommentsSerializer)
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class PostComments(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, post_id):
        post = Post.objects.get(id=post_id, course_id=course_id)
        post_serializer = ForumPostSerializer(post, context={'user': request.user})
        comments = Comment.objects.filter(post_id=post_id)
        comment_serializer = PostCommentsSerializer(comments, many=True, context={'user': request.user})
        return Response({
                'post': post_serializer.data,
                'comments': comment_serializer.data
            }, status=status.HTTP_200_OK)

class CreateComment(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id, post_id):
        request.data.update({
            'post_id': post_id,
            'created_by_id': request.user.id
        })

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            comment = serializer.create(request.data)

        if not comment:
            raise ValidationError('Something went wrong, please try again.')
        return Response(data={'comment': CommentSerializer(comment).data}, status=status.HTTP_201_CREATED)
    
class EditComment(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        serializer = CommentSerializer(comment)
        self.check_object_permissions(request, comment)
        
        images_serializer = CommentImageSerializer(CommentImage.objects.filter(comment_id=comment_id), many=True)
        return Response(
            data={
                'comment': serializer.data,
                'images': images_serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    def put(self, request, course_id, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        serializer = CommentSerializer(request.data)
        self.check_object_permissions(request, comment)
        
        comment.text = serializer.data['text']
        comment.save()
        serialized_comment = CommentSerializer(comment)

        return Response({'comment': serialized_comment.data}, status=status.HTTP_200_OK)
    
class AddCommentImage(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        self.check_object_permissions(request, comment)

        for code in request.data['image_codes']:
            CommentImage.objects.create(code=code, comment_id=comment.id)
        return Response(status=status.HTTP_201_CREATED)
    

class DeleteCommentImage(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)
    
    def delete(self, request, course_id, post_id, comment_id, comment_image_id):
        post = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        self.check_object_permissions(request, post)

        comment_image = CommentImage.objects.get(id=comment_image_id, comment_id=comment_id)
        comment_image.delete()

        return Response(status=status.HTTP_200_OK)
    
class DeleteComment(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        self.check_object_permissions(request, comment)

        comment.delete()

        return Response(status=status.HTTP_200_OK)
class LikeComment(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request, course_id, post_id, comment_id):
        like = LikedComment.objects.filter(user_id=request.user.id , comment_id=comment_id)
        if not like:
            LikedComment.objects.create(user_id=request.user.id , comment_id=comment_id)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)

class UnlikeComment(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def delete(self, request, course_id, post_id, comment_id):
        like = LikedComment.objects.get(user_id=request.user.id , comment_id=comment_id)
        if like:
            like.delete()
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)