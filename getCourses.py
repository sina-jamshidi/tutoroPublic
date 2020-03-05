# this script gets a course list from SFU and saves it as a csv
# it is based on API documentation that could be found here: http://www.sfu.ca/outlines/help/api.html
import requests
import pandas as pd

term_year = "2020"
term_sem = "summer"
base_URL = "http://www.sfu.ca/bin/wcm/course-outlines"
PARAMS = {'year':term_year, 'term': term_sem}
departments_request = requests.get(url=base_URL, params = PARAMS)
data = departments_request.json()

final_data = []
id = 0
for department in data:
    department_name = department['text']
    PARAMS = {'year':term_year, 'term': term_sem, 'dept': department_name}
    courses_request = requests.get(url=base_URL, params = PARAMS)
    courses_data = courses_request.json()
    for course in courses_data:
        final_data.append({"course_id": id, "course_dept": department_name, \
            "course_num": course['text'], "course_title": course['title']})
        id += 1

df = pd.DataFrame(final_data)
df.to_csv('courses.csv', index=False)

# course id needs to persist between semesters
# in the future will keep a masterlist and see which courses are offered each semester from that list
# will also have to show diffs to find course number and name changes
