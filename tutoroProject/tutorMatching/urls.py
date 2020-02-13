from django.urls import path
from .api import GetCoursesAPI, AddStudentEntryAPI, AddTutorEntryAPI, UpdateTutorPriceAPI, \
    GetStudentsAPI, RemoveStudentEntryAPI, RemoveTutorEntryAPI, GetTutorsAPI, GetOwnDetailsAPI, \
        AddMatchStudentAPI, AddMatchTutorAPI

urlpatterns = [
    path('/profile/details', GetOwnDetailsAPI.as_view()),
    path('/courses/all', GetCoursesAPI.as_view()),
    path('/students', GetStudentsAPI.as_view()),
    path('/students/add', AddStudentEntryAPI.as_view()),
    path('/students/del', RemoveStudentEntryAPI.as_view()),
    path('/tutors', GetTutorsAPI.as_view()),
    path('/tutors/add', AddTutorEntryAPI.as_view()),
    path('/tutors/update_price', UpdateTutorPriceAPI.as_view()),
    path('/tutors/del', RemoveTutorEntryAPI.as_view()),
    path('/match/student/add', AddMatchStudentAPI.as_view()),
    path('/match/tutor/add', AddMatchTutorAPI.as_view()),
]
