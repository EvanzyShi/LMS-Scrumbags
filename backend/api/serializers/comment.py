from api.models import Comment
from api.serializers import UserSerializer
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'text', 'date_edited', 'date_created', 'created_by_id']

class PostCommentsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    num_likes = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()

    def get_num_likes(self, obj):
        return obj.likedcomment_set.count()

    def get_liked_by_user(self, obj):
        return obj.likedcomment_set.filter(user_id=self.context.get('user').id).exists()
    
    def get_is_edited(self, obj):
        return obj.date_created != obj.date_edited
    
    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'text', 'created_by', 'num_likes', 'liked_by_user', 'is_edited', 'is_edited', 'date_edited', 'date_created']