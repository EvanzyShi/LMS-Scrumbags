from api.models.assignment import Assignment
from api.models.course import Course
from api.models.file import File
from api.models.participates import Participates
from api.models.submission import Submission
from api.models.topic import Topic
from api.serializers.course import CourseSerializer
from api.serializers.participates import ParticipatesSerializer
from rest_framework import status
from rest_framework.response import Response

from .file_helper import delete_file


def delete_topic(topic_id):
    files = File.objects.filter(folder='topic', reference_id=topic_id)
    for file in files:
        delete_file(file)
    topic = Topic.objects.get(id=topic_id)
    topic.delete()

def delete_assignment(assignment_id):
    submissions = Submission.objects.filter(assignment=assignment_id)
    for submission in submissions:
        submission_files = File.objects.filter(folder='submission', reference_id=submission.id)
        for file in submission_files:
            delete_file(file)
        submission.delete()

    assignment_files = File.objects.filter(folder='assignment', reference_id=assignment_id)
    for file in assignment_files:
        delete_file(file)
    assignment = Assignment.objects.get(id=assignment_id)
    assignment.delete()


def courses_helper(request_id, course_active=None):
    """
    Returns json of all courses student has/is enrolled in.
    """
    
    enrollments = Participates.objects.filter(user_id=request_id)
    enrollment_serializer = ParticipatesSerializer(enrollments, many=True)
    
    course_ids = []
    for enrol in enrollment_serializer.data:
        course_ids.append(enrol['course_id'])
    if course_active == None:
        courses = Course.objects.filter(id__in=course_ids)
    else:
        courses = Course.objects.filter(id__in=course_ids, is_active=course_active)
    course_serializer = CourseSerializer(courses, many=True)

    return Response(
        data={'courses': course_serializer.data},
        status=status.HTTP_200_OK
    )