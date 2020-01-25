import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeStudent } from "../../actions/students";
import { getProfile } from "../../actions/profile";

//TODO: right now doing 2 api calls to the same endpoint to get current tutoring and studying
export class StudentList extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
        removeStudent: PropTypes.func.isRequired,
        getProfile: PropTypes.func.isRequired,
    }
    
    state = {
      studentCourseIds: [],
      studentCourses: []
    }


    setStateCourses = () => {
      const ids = [];
      for (let i=0;i<this.props.profile.student.length;i++){
        ids.push(this.props.profile.student[i].course);
      }
      
      const filteredCourses = [];
      for (let i=0;i<this.props.courses.length;i++) {
        if (ids.includes(this.props.courses[i].course_id)){
          filteredCourses.push(this.props.courses[i]);
        }
      }

      this.setState({
        studentCourseIds: ids,
        studentCourses: filteredCourses
      });
    }

    //update state on component mount
    componentDidMount() {
      this.setStateCourses();
    }

    //update state in case a course is added or removed (check prev props)
    componentDidUpdate(prevProps) {
      //this is in case the profile was null before. in that case can't check student length
      if(this.props.profile !== null) {
        if(prevProps.profile === null) {
          this.setStateCourses();
        }
      else if(prevProps.profile.student.length !== this.props.profile.student.length){
          this.setStateCourses();
        }
      }
    }

    removeClick(id) {
      this.props.removeStudent(id);
      this.props.getProfile();
    }

    render() {
      if (this.state.studentCourses === undefined || this.state.studentCourses.length === 0){
        return (
          <Fragment>
          <p>Currently you do not have any courses listed.</p>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Number</th>
                  <th>Name</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                { this.state.studentCourses.map(course => (
                  <tr key={course.course_id} >
                    <td>{course.course_dept}</td>
                    <td>{course.course_num}</td>
                    <td>{course.course_title}</td>
                    <td>
                      <button
                        onClick={this.removeClick.bind(this, course.course_id)}
                        className="btn btn-danger btn-sm"
                      >
                        {" "}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        );
      }
    }
}

const mapStateToProps = state => {
  return ({
    courses: state.courses.courses,
    profile: state.profile.profile
  });
}

export default connect(mapStateToProps, { removeStudent, getProfile })(StudentList);