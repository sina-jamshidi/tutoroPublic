import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addStudent } from "../../actions/students";
import { createMessage } from "../../actions/messages";
import { getProfile } from "../../actions/profile";

export class StudentForm extends Component {
    state = {
        course_id: -1,
        course_dept: "",
        course_num: "",
        course_title: ""
    };

    static propTypes = {
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
        addStudent: PropTypes.func.isRequired,
        createMessage: PropTypes.func.isRequired,
        getProfile: PropTypes.func.isRequired,
    };

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

    render() {
        const { course_id, course_dept, course_title, course_num } = this.state;
        // turn courses into arrays for auto complete
        //TODO: add autocomplete
        // depts = [];
        // names = [];
        // titles = [];
        // for (i=0;i<this.props.courses.length;i++) {
        //     depts.push(this.props.courses[i].course_dept);
        //     names.push(this.props.courses[i].course_names);
        //     titles.push(this.props.courses[i].course_titles);
        // }
        return (
        <div className="card card-body mt-4 mb-4">
            <h5>Add course you need help with</h5>
            <form onSubmit={this.onSubmit}>
            <div className="form-group">
                <label>Department</label>
                <input
                className="form-control"
                type="text"
                name="course_dept"
                onChange={this.onChange}
                value={course_dept}
                />
            </div>
            <div className="form-group">
                <label>Course Number</label>
                <input
                className="form-control"
                type="number"
                name="course_num"
                onChange={this.onChange}
                value={course_num}
                />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-primary">
                Add Course
                </button>
            </div>
            </form>
        </div>
        );
    }
}

const mapStateToProps = state => ({
    courses: state.courses.courses,
    profile: state.profile.profile
});

export default connect(mapStateToProps, { createMessage, addStudent, getProfile })(StudentForm);