from api.models.file import File
from rest_framework import serializers


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'token', 'folder', 'reference_id', 'filename', 'added_by_id', 'uploaded_on']

    def create(self, clean_data):
        file = File.objects.create(
            folder=clean_data['folder'],
            reference_id=clean_data['reference_id'],
            filename=clean_data['filename'],
            added_by_id=clean_data['added_by_id'],
        )
        file.save()

        return file