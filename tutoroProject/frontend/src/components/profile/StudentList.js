import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeStudent } from "../../actions/students";
import { addStudent } from "../../actions/students";
import { createMessage } from "../../actions/messages";
import { getProfile } from "../../actions/profile";

//TODO: right now doing 2 api calls to the same endpoint to get current tutoring and studying
//TODO: find better way to make this so that can modularize the form out again?
//TODO: add autocomplete to form fields
export class StudentList extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
        removeStudent: PropTypes.func.isRequired,
        addStudent: PropTypes.func.isRequired,
        createMessage: PropTypes.func.isRequired,
        getProfile: PropTypes.func.isRequired,
    }
    
    state = {
      studentCourseIds: [],
      studentCourses: [],
      course_id: -1,
      course_dept: "",
      course_num: "",
      course_title: ""      
    }


    setStateCourses = () => {
      const ids = [];
      for (let i=0;i<this.props.profile.student.length;i++){
        ids.push(this.props.profile.student[i].course);
      }
      
      let filteredCourses = [];
      for (let i=0;i<this.props.courses.length;i++) {
        if (ids.includes(this.props.courses[i].course_id)){
          filteredCourses.push(this.props.courses[i]);
        }
      }

      filteredCourses.sort((a, b) => {
        if(a.course_dept.toLowerCase() < b.course_dept.toLowerCase()) {
            return -1;
        }
        if(a.course_dept.toLowerCase() > b.course_dept.toLowerCase()) {
            return 1;
        }
        if(parseInt(a.course_num) < parseInt(b.course_num)) {
            return -1;
        }
        if(parseInt(a.course_num) > parseInt(b.course_num)) {
            return 1;
        }
        return 0;
      })

      this.setState({
        ...this.state,
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

    // start form functions //
    courseExists = () => {
        for (let i=0; i < this.props.courses.length; i++) {
            if (this.props.courses[i].course_dept.toLowerCase() === this.state.course_dept.toLowerCase()) {
                if (this.props.courses[i].course_num === parseInt(this.state.course_num)) {
                    return this.props.courses[i].course_id;
                }
            }
        }
        return -1;
    };

    courseDuplicate = (id) => {
        for (let i=0; i < this.props.profile.student.length; i++) {
            if (this.props.profile.student[i].course === id) {
                return true;
            }
        }
        return false;
    };

    courseMutualExclusion = (id) => {
        for (let i=0; i < this.props.profile.tutor.length; i++) {
            if (this.props.profile.tutor[i].course === id) {
                return true;
            }
        }
        return false;
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        if (this.state.course_dept === "" || this.state.course_num === "") {
            this.props.createMessage({ allFieldsRequired: "All fields are required" });
            return;
        }
        let id = this.courseExists(this.state.course_dept, this.state.course_num);
        if(this.courseDuplicate(id)) {
            this.props.createMessage({ courseDuplicate: "This course already in list"});
            return;
        }
        if(this.courseMutualExclusion(id)) {
            this.props.createMessage({ mutualExclusion: "You can't ask for help and tutor the same course"});
            return;
        }
        if(this.props.profile.student.length >= 5) {
            this.props.createMessage({ tooManyCourses: "You can have maximum 5 courses listed"});
            return;
        }
        if (id !== -1) {
            this.props.addStudent(id);
            this.setState({
            ...this.state,
            course_id: -1,
            course_dept: "",
            course_num: "",
            course_title: ""
            });
            this.props.getProfile();
        }
        else {
            this.props.createMessage({ courseNotFound: "Please ensure you have entered course details correctly" });
        }
    };
    // end form functions //

    render() {
        const { course_id, course_dept, course_title, course_num } = this.state;

        // the form row for adding to the table. Only shows up if less than 5 courses added
        const formRow = (
            <tr>
            <td>
                <input
                className="form-control"
                type="text"
                name="course_dept"
                onChange={this.onChange}
                value={course_dept}
                />
            </td>
            <td>
                <input
                className="form-control"
                type="number"
                name="course_num"
                onChange={this.onChange}
                value={course_num}
                />
            </td>
            <td>

            </td>
            <td>
                <form onSubmit={this.onSubmit}>
                <button type="submit" className="btn btn-primary btn-sm">
                    Add Course
                </button>
                </form>
            </td>
            </tr>
        );

        const noCoursesMessage = (
            <h5>Currently you do not have any courses listed.</h5>
        );

        return (
            <Fragment>
            { this.state.studentCourses === undefined || this.state.studentCourses.length === 0 ? 
            noCoursesMessage : null }
            <table style={{verticalAlign:'middle'}} className="table table-striped">
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
                { this.state.studentCourses.length < 5 ? formRow : null }
                </tbody>
            </table>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
  return ({
    courses: state.courses.courses,
    profile: state.profile.profile
  });
}

export default connect(mapStateToProps, { createMessage, addStudent, removeStudent, getProfile })(StudentList);