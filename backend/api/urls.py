import os.path

from django.urls import include, path

from . import views

PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))

urlpatterns = [
    # User
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    
    # Course
    path('courses', views.CoursesAll.as_view(), name='courses_all'),
    path('courses/all', views.CoursesGetAll.as_view(), name='courses_get_all'),
    path('courses/<int:course_id>', views.CoursesGet.as_view(), name='courses_course'),
    path('courses/completed', views.CoursesCompleted.as_view(), name='courses_completed'),
    path('courses/ongoing', views.CoursesOngoing.as_view(), name='courses_ongoing'),
    
    # Tutorials
    path('course/<int:course_id>/tutorials', views.AllTutorials.as_view(), name='tutorials'),
    path('course/<int:course_id>/tutorials/new', views.NewTutorial.as_view(), name='new_tutorial'),
    path('course/<int:course_id>/tutorials/<int:lesson_id>/delete', views.DeleteTutorial.as_view(), name='delete_tutorial'),
    
    # Resources
    path('course/<int:course_id>/lecture/resources', views.LectureResources.as_view(), name='lecture_resources'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources', views.Resources.as_view(), name='lesson_resources'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/new', views.TopicNew.as_view(), name='add_topic'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/<int:topic_id>/update', views.TopicUpdate.as_view(), name='update_topic'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/<int:topic_id>/upload', views.ResourcesFileUpload.as_view(), name='upload_file_to_topic'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/<int:topic_id>/delete', views.DeleteTopic.as_view(), name='delete_topic'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/<int:topic_id>/<int:file_id>/download', views.ResourcesFileDownload.as_view(), name='download_file'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/resources/<int:topic_id>/<int:file_id>/delete', views.DeleteFile.as_view(), name='delete_file'),
    path('course/<int:course_id>/search', views.SearchResources.as_view(), name='search_resources'),
    path('course/<int:course_id>/file/<int:file_id>/download', views.FileDownload.as_view(), name='search_download'),
    
    # Courses
    path('courses/<int:course_id>/join', views.CoursesJoin.as_view(), name='courses_join'),
    path('courses/create', views.CoursesCreate.as_view(), name='courses_create'),
    path('courses/<int:course_id>/add-class', views.CoursesClass.as_view(), name='courses_add_class'),
    
    # Forums
    path('forum/<int:course_id>', views.ForumPosts.as_view(), name='forum_posts'),
    path('forum/<int:course_id>/post/create', views.CreatePost.as_view(), name='create_post'),
    path('forum/<int:course_id>/post/<int:post_id>/edit', views.EditPost.as_view(), name='edit_post'),
    path('forum/<int:course_id>/post/<int:post_id>/image/add', views.AddPostImage.as_view(), name='add_post_image'),
    path('forum/<int:course_id>/post/<int:post_id>/image/<int:post_image_id>', views.DeletePostImage.as_view(), name='delete_post_image'),
    path('forum/<int:course_id>/post/<int:post_id>/delete', views.DeletePost.as_view(), name='delete_post'),
    path('forum/<int:course_id>/post/<int:post_id>/like', views.LikePost.as_view(), name='like_post'),
    path('forum/<int:course_id>/post/<int:post_id>/unlike', views.UnlikePost.as_view(), name='unlike_post'),
    path('forum/<int:course_id>/tags', views.Tags.as_view(), name='tags'),
    path('forum/<int:course_id>/tag/create', views.CreateTag.as_view(), name='create_tag'),
    path('forum/<int:course_id>/tag/<int:tag_id>/edit', views.EditTag.as_view(), name='edit_tag'),
    path('forum/<int:course_id>/post/<int:post_id>', views.PostComments.as_view(), name='comments'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/create', views.CreateComment.as_view(), name='create_comment'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/edit', views.EditComment.as_view(), name='edit_comment'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/image/add', views.AddCommentImage.as_view(), name='add_comment_image'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/image/<int:comment_image_id>', views.DeleteCommentImage.as_view(), name='delete_comment_image'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/delete', views.DeleteComment.as_view(), name='delete_comment'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/like', views.LikeComment.as_view(), name='like_comment'),
    path('forum/<int:course_id>/post/<int:post_id>/comment/<int:comment_id>/unlike', views.UnlikeComment.as_view(), name='unlike_comment'),

    # Assignments
    path('course/<int:course_id>/assessments/assignments', views.AssignmentsAll.as_view(), name='all_assignments'),
    path('course/<int:course_id>/assessments/assignments/new', views.AssignmentNew.as_view(), name='create_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/update', views.AssignmentUpdate.as_view(), name='update_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/delete', views.AssignmentDelete.as_view(), name='delete_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/<int:file_id>/download', views.AssignmentFileDownload.as_view(), name='download_assignment_file'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/<int:file_id>/delete', views.AssignmentDeleteFile.as_view(), name='delete_assignment_file'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>', views.AssignmentView.as_view(), name='assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submit', views.AssignmentSubmit.as_view(), name='submit_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submissions', views.AssignmentSubmissions.as_view(), name='assignment_all_submissions'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submission/<int:submission_id>/mark', views.AssignmentMark.as_view(), name='mark_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submission/<int:submission_id>/<int:file_id>', views.AssignmentSubmissionFileDownload.as_view(), name='download_submission_file'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submission/<int:submission_id>/<int:file_id>/delete', views.AssignmentSubmissionDeleteFile.as_view(), name='delete_submission_file'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/submission/<int:submission_id>', views.AssignmentReview.as_view(), name='review_assignment'),
    path('course/<int:course_id>/assessments/assignments/<int:assignment_id>/feedback', views.AssignmentFeedback.as_view(), name='feedback_assignment'),
    
    # Quizzes
    path('course/<int:course_id>/quizzes', views.Quizzes.as_view(), name='quizzes'),
    path('course/<int:course_id>/quiz/create', views.CreateQuiz.as_view(), name='create_quiz'),
    path('course/<int:course_id>/quiz/<int:quiz_id>/questions', views.QuizQuestions.as_view(), name='quiz_questions'),
    path('course/<int:course_id>/quiz/<int:quiz_id>/submit', views.SubmitQuiz.as_view(), name='submit_quiz'),
    path('course/<int:course_id>/quiz/<int:quiz_id>/responses', views.QuizResponses.as_view(), name='quiz_responses'),
    path('course/<int:course_id>/quiz/<int:quiz_id>/response/<int:quiz_response_id>', views.MarkResponse.as_view(), name='mark_response'),
    path('course/<int:course_id>/quiz/<int:quiz_id>/feedback', views.QuizFeedback.as_view(), name='quiz_feedback')
]