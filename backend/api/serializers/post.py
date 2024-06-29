from api.models import Post
from api.serializers import PostImageSerializer, TagSerializer, UserSerializer
from rest_framework import serializers


class ForumPostSerializer(serializers.ModelSerializer):
    tag = TagSerializer()
    created_by = UserSerializer()
    num_likes = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    num_comments = serializers.SerializerMethodField()
    image_codes = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()

    def get_num_likes(self, obj):
        return obj.likedpost_set.count()
    
    def get_liked_by_user(self, obj):
        return obj.likedpost_set.filter(user_id=self.context.get('user').id).exists()

    def get_num_comments(self, obj):
        return obj.comment_set.count()
    
    def get_image_codes(self, obj):
        return PostImageSerializer(obj.postimage_set, many=True).data
    
    def get_is_edited(self, obj):
        return obj.date_created != obj.date_edited

    class Meta:
        model = Post
        fields = ['id', 'course_id', 'title', 'tag', 'text', 'num_likes', 'liked_by_user', 'num_comments', 'image_codes', 'anonymous', 'created_by', 'is_edited', 'date_edited', 'date_created']

class PostSerializer(serializers.ModelSerializer):
    tag = serializers.PrimaryKeyRelatedField(allow_null=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'course_id', 'title', 'tag', 'text', 'anonymous', 'created_by_id', 'date_edited', 'date_created']

class PostEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'tag_id', 'text']

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'course_id', 'tag_id', 'text', 'anonymous', 'created_by_id', 'date_edited', 'date_created']