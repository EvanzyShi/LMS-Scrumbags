from api.models.assignment import Assignment
from api.models.file import File
from api.models.lesson import Lesson
from api.models.participates import Participates
from api.models.submission import Submission
from api.models.topic import Topic
from api.serializers.user import UserSerializer


def is_participant(request, cid):
    user_serializer = UserSerializer(request.user)
    id = user_serializer.data['id']
    return bool(Participates.objects.get(user_id=id, course_id=cid))

def is_staff(request):
    user_serializer = UserSerializer(request.user)
    return user_serializer.data['is_staff']

def is_valid_path(course_id, lesson_id=None, assignment_id=None, topic_id=None, file_id=None, submission_id=None):
    if file_id:
        file = File.objects.get(id=file_id)
        if not file.folder in ['topic', 'assignment', 'submission']:
            return False
        elif (file.folder == 'topic') and (file.reference_id != topic_id):
            return False
        elif (file.folder == 'assignment') and (file.reference_id != assignment_id):
            return False
        elif (file.folder == 'submission') and (file.reference_id != submission_id):
            return False

    if topic_id:
        topic = Topic.objects.get(id=topic_id)
        if topic.lesson.id != lesson_id:
            return False
    if submission_id:
        submission = Submission.objects.get(id=submission_id)
        if submission.assignment.id != assignment_id:
            return False
    if lesson_id:
        lesson = Lesson.objects.get(id=lesson_id)
        return lesson.course.id == course_id
    if assignment_id:
        assignment = Assignment.objects.get(id=assignment_id)
        return assignment.course.id == course_id
    raise Exception("Not enough fields supplied")