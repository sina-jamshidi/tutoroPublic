# from rest_framework import routers
# from .api import StudentsViewSet, TutorsViewSet, CoursesViewSet, RatingsViewSet, AddStudentEntryAPI
from django.urls import path
from .api import GetCoursesAPI, AddStudentEntryAPI, AddTutorEntryAPI, GetStudentsAPI, \
    RemoveStudentEntryAPI, RemoveTutorEntryAPI, GetTutorsAPI, GetOwnDetailsAPI, \
        AddMatchStudentAPI, AddMatchTutorAPI

urlpatterns = [
    path('/profile/details', GetOwnDetailsAPI.as_view()),
    path('/courses/all', GetCoursesAPI.as_view()),
    path('/students', GetStudentsAPI.as_view()),
    path('/students/add', AddStudentEntryAPI.as_view()),
    path('/students/del', RemoveStudentEntryAPI.as_view()),
    path('/tutors', GetTutorsAPI.as_view()),
    path('/tutors/add', AddTutorEntryAPI.as_view()),
    path('/tutors/del', RemoveTutorEntryAPI.as_view()),
    path('/match/student/add', AddMatchStudentAPI.as_view()),
    path('/match/tutor/add', AddMatchTutorAPI.as_view()),
]




# router = routers.DefaultRouter(trailing_slash=False)
# # router.register('/users', UsersViewSet, 'users')
# router.register('/students', StudentsViewSet, 'students')
# # router.register('/students/create', AddStudentEntryAPI, 'add_student')
# router.register('/tutors', TutorsViewSet, 'tutors')
# # router.register('/matches', MatchesViewSet, 'matches')
# router.register('/courses', CoursesViewSet, 'courses')
# router.register('/ratings', CoursesViewSet, 'ratings')

# urlpatterns = router.urls
