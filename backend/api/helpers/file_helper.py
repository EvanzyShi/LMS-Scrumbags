import os

import boto3
from api.models.file import File
from api.serializers import FileUploadSerializer
from config import settings
from django.http import HttpResponse, HttpResponseNotFound
from rest_framework.exceptions import ValidationError

access_key = settings.AWS_ACCESS_KEY_ID
access_secret_key = settings.AWS_SECRET_ACCESS_KEY
bucket_name = settings.AWS_STORAGE_BUCKET_NAME
   
def file_upload(file, user_id :int, folder :str, reference_id :int):
    data = {
        'folder': folder,
        'reference_id': reference_id,
        'filename': file.name,
        'added_by_id': user_id
    }
    serializer = FileUploadSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        file_obj = serializer.create(data)
    if not file_obj:
        raise ValidationError('Something went wrong, please try again.')
    s3_client = boto3.client(
        's3',
        aws_access_key_id = access_key,
        aws_secret_access_key = access_secret_key
    )
    s3_client.upload_fileobj(
        file,
        bucket_name,
        folder + '/' + file_obj.token.hex + os.path.splitext(file.name)[1],
    )
    return file_obj

def file_download(file: File, attachment_type: str):
    s3_client = boto3.client(
        's3',
        aws_access_key_id = access_key,
        aws_secret_access_key = access_secret_key
    )

    s3_client.download_file(
        bucket_name, 
        file.folder + '/' + file.token.hex + os.path.splitext(file.filename)[1], 
        file.filename
    )
    try:    
        with open(file.filename, 'rb') as f:
            file_data = f.read()
        response = HttpResponse(file_data, content_type=attachment_type)
        response['Content-Disposition'] = f'attachment; filename="{file.filename}"'
        os.remove(file.filename)
    except IOError:
        response = HttpResponseNotFound('File not exist')
    return response

def delete_file(file: File):
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id = access_key,
            aws_secret_access_key = access_secret_key
        )
        s3_client.delete_object(
            Bucket=bucket_name, 
            Key=file.folder + '/' + file.token.hex + os.path.splitext(file.filename)[1]
        )
        file.delete()
    except Exception as e:
        print(e) 
