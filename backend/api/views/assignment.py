from api.helpers.authentication_helper import *
from api.helpers.course_helper import delete_assignment
from api.helpers.file_helper import *
from api.helpers.frontend_datetime_convert import *
from api.models.assignment import Assignment
from api.models.course import Course
from api.models.participates import Participates
from api.models.submission import Submission
from api.models.user import User
from api.serializers.assignment import (AssignmentLateCheckSerializer,
                                        AssignmentSerializer)
from api.serializers.participates import ParticipatesSerializer
from api.serializers.submissions import (SubmissionDataSerializer,
                                         SubmissionSerializer)
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView


class AssignmentsAll(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None):
        if not (is_participant(request, course_id)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        assignments = Assignment.objects.filter(course=course_id)

        return Response(
            {'assignments': AssignmentLateCheckSerializer(assignments, many=True, context={'user_id': request.user.id}).data},
            status=status.HTTP_200_OK
        )

class AssignmentNew(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, course_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        assignment = Assignment.objects.create(
            title=request.data['title'], 
            description=request.data['description'], 
            due_date=convert(request.data['due_date']), 
            course=Course.objects.get(id=course_id)
        )
        assignment_data = AssignmentSerializer(assignment).data
        request_files = request.FILES.getlist('files')
        for file in request_files:
            file_upload(file, request.user.id, 'assignment', assignment.id)
        filenames = []
        all_files = File.objects.filter(reference_id=assignment.id, folder='assignment')
        for file in all_files:
            filenames.append(file.filename)
        send_emails(course_id, f"New assignment: {assignment.title}")
        assignment.save()
        return Response(
            data={'assignment': assignment_data},
            status=status.HTTP_201_CREATED
        )

class AssignmentUpdate(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, assignment_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        assignment = Assignment.objects.get(id=assignment_id)
        file_ids = []
        files = File.objects.filter(reference_id=assignment_id, folder='assignment')
        for file in files:
            file_ids.append((file.id, file.filename))

        return Response(
            {'assignment': AssignmentSerializer(assignment).data, 'files': file_ids},
            status=status.HTTP_200_OK
        )

    def put(self, request, course_id=None, assignment_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        assignment = Assignment.objects.get(id=assignment_id)
        assignment.title = request.data['title']
        assignment.description=request.data['description']
        assignment.due_date=request.data['due_date']
        assignment.save()

        request_files = request.FILES.getlist('files')
        for file in request_files:
            file_upload(file, request.user.id, 'assignment', assignment.id)
        filenames = []
        all_files = File.objects.filter(reference_id=assignment_id, folder='assignment')
        for file in all_files:
            filenames.append(file.filename)
        send_emails(course_id, f"Update to {assignment.title}")

        return Response(
            data={'assignment': AssignmentSerializer(assignment).data},
            status=status.HTTP_202_ACCEPTED
        )

class AssignmentDelete(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id=None, assignment_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        delete_assignment(assignment_id)
        return Response(status=status.HTTP_200_OK)

class AssignmentFileDownload(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, course_id=None, assignment_id=None,file_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, file_id=file_id):
            return Response(
                "wrong order",
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        return file_download(file, 'assignment_attachment')

class AssignmentDeleteFile(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id, assignment_id=None, file_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, file_id=file_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        delete_file(file)
        return Response(status=status.HTTP_200_OK)

class AssignmentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, assignment_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        assignment_obj = Assignment.objects.get(id=assignment_id)
        response_data = AssignmentLateCheckSerializer(assignment_obj, context={'user_id': request.user.id}).data
        file_ids = []
        files = File.objects.filter(reference_id=assignment_id, folder='assignment')
        for file in files:
            file_ids.append((file.id, file.filename))
        response_data['files'] = file_ids
        return Response(response_data, status=status.HTTP_200_OK)

class AssignmentSubmit(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, assignment_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        
        submission = Submission.objects.filter(student_id=request.user.id, assignment_id=assignment_id)
        if submission:
            submission = submission[0]
            return Response(
                {"submission": SubmissionSerializer(submission).data},
                status=status.HTTP_200_OK
            )
        return Response("No Submission", status=status.HTTP_200_OK)
    
    def put(self, request, course_id, assignment_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        previous_submission = Submission.objects.filter(student_id=request.user.id, assignment_id=assignment_id)
        if previous_submission:
            previous_submission = previous_submission[0]
            files = File.objects.filter(folder='submission', reference_id=previous_submission.id)
            for file in files:
                delete_file(file)
            previous_submission.delete()

        submission = Submission.objects.create(
            student=User.objects.get(id=request.user.id),
            assignment=Assignment.objects.get(id=assignment_id),
            submission_date=timezone.now()
            )
        submission.save()
        files = request.FILES.getlist('files')
        filenames = []
        for file in files:
            file_obj = file_upload(file, request.user.id, 'submission', submission.id)
            filenames.append(file_obj.filename)
        return Response(
            {'submission': SubmissionSerializer(submission).data, 'files': filenames},
            status=status.HTTP_201_CREATED
        )

class AssignmentSubmissions(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, course_id=None, assignment_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        title = Assignment.objects.get(id=assignment_id).title
        submissions = Submission.objects.filter(assignment=assignment_id)
        if not submissions:
            return Response(
                {"title": title, "submissions": []},
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'title': title, 
                'submissions': SubmissionDataSerializer(submissions, many=True).data
            },
            status=status.HTTP_200_OK
        )

class AssignmentMark(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, assignment_id=None, submission_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, submission_id=submission_id):
            return Response(
                "Invalid course/assignment/submission path",
                status=status.HTTP_404_NOT_FOUND
            )
        submission_obj = Submission.objects.get(id=submission_id)
        response_data = SubmissionSerializer(submission_obj).data
        student = submission_obj.student
        response_data['student_name'] = student.firstname + ' ' + student.lastname
        file_ids = []
        files = File.objects.filter(reference_id=submission_id, folder='submission')
        for file in files:
            file_ids.append((file.id, file.filename))
        response_data['files'] = file_ids
        return Response(
            response_data,
            status=status.HTTP_200_OK
        )

    def put(self, request, course_id=None, assignment_id=None, submission_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, submission_id=submission_id):
            return Response(
                "Invalid course/assignment/submission path",
                status=status.HTTP_404_NOT_FOUND
            )
        if int(request.data['grade']) < 0 or int(request.data['grade']) > 100:
            return Response(
                "Grade must be between 0 and 100",
                status=status.HTTP_400_BAD_REQUEST
            )
        submission = Submission.objects.get(id=submission_id)
        submission.status = "Graded"

        submission.grade = request.data['grade']
        if 'feedback' in request.data.keys():
            submission.feedback = request.data['feedback']
        
        old_feedback_files = File.objects.filter(reference_id=submission_id, folder='submission', added_by=request.user.id)
        for file in old_feedback_files:
            delete_file(file)
        
        old_feedback_files = File.objects.filter(reference_id=submission_id, folder='submission', added_by=request.user.id)
        for file in old_feedback_files:
            delete_file(file)
        files = request.FILES.getlist('files')
        filenames = []
        for file in files:
            file_obj = file_upload(file, request.user.id, 'submission', submission.id)
            filenames.append(file_obj.filename)
        submission.save()

        return Response(
            {'submission': SubmissionSerializer(submission).data, 'files': filenames},
            status=status.HTTP_200_OK
        )

class AssignmentSubmissionFileDownload(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, course_id=None, assignment_id=None, submission_id=None, file_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, submission_id=submission_id, file_id=file_id):
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        return file_download(file, 'submission_attachment')

class AssignmentSubmissionDeleteFile(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def delete(self, request, course_id, assignment_id=None, submission_id=None, file_id=None):
        if not (is_participant(request, course_id) and is_staff(request)):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, submission_id=submission_id, file_id=file_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        file = File.objects.get(id=file_id)
        delete_file(file)
        return Response(status=status.HTTP_200_OK)

class AssignmentFeedback(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id=None, assignment_id=None):
        submission = Submission.objects.get(assignment=assignment_id, student=request.user.id)
        return redirect(f'/course/{course_id}/assessments/assignments/{assignment_id}/submission/{submission.id}')
    
class AssignmentReview(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, course_id, assignment_id=None, submission_id=None):
        if not is_participant(request, course_id):
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )
        if not is_valid_path(course_id, assignment_id=assignment_id, submission_id=submission_id):
            return Response(
                "Invalid course/assignment path",
                status=status.HTTP_404_NOT_FOUND
            )
        
        submission = Submission.objects.get(id=submission_id)
        file_ids = []
        files = File.objects.filter(reference_id=submission_id, folder='submission')
        for file in files:
            file_ids.append((file.id, file.filename))
        response_data = SubmissionSerializer(submission).data
        student = submission.student
        response_data['student_name'] = student.firstname + ' ' + student.lastname
        response_data['files'] = file_ids
        response_data['submission_id'] = submission_id
        return Response(
            response_data,
            status=status.HTTP_200_OK
        )

def send_emails(course_id, message):
    course = Course.objects.get(id=course_id)
    send_list = []
    participates = ParticipatesSerializer(Participates.objects.filter(course_id=course_id), many=True)
    for participant in participates.data:
        email = User.objects.get(id=participant['user_id']).email
        send_list.append(email)

    send_mail(
        message,
        f"{message} in {course.name}\nPlease navigate to 127.0.0.1:3000/course to see your new material.",
        "ScrumBags2024@gmail.com",
        User.objects.filter(
            id__in=Participates.objects.filter(course_id=course_id).values_list('user_id', flat=True)
        ).values_list('email', flat=True)
    )