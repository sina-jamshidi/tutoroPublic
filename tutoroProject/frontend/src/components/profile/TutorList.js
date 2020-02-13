import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeTutor } from "../../actions/tutors";
import { addTutor } from "../../actions/tutors";
import { updateTutorPrice } from "../../actions/tutors";
import { getProfile } from "../../actions/profile";
import { createMessage } from "../../actions/messages";
import EditableLabel from 'react-inline-editing';

//TODO: ability to edit price/hour
//TODO: right now doing 2 api calls to the same endpoint to get current tutoring and studying
//TODO: add autocomplete to form
export class TutorList extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
        removeTutor: PropTypes.func.isRequired,
        addTutor: PropTypes.func.isRequired,
        updateTutorPrice: PropTypes.func.isRequired,
        createMessage: PropTypes.func.isRequired,
        getProfile: PropTypes.func.isRequired,
    }
    
    state = {
      tutorCourseIds: [],
      tutorCoursePrices: [],
      tutorCourses: [],
      course_id: -1,
      course_dept: "",
      course_num: "",
      course_title: "",
      course_price: "",
    }

    setStateCourses = () => {
      const ids = [];
      const prices = [];
      for (let i=0;i<this.props.profile.tutor.length;i++){
        ids.push(this.props.profile.tutor[i].course);
        prices.push({id:this.props.profile.tutor[i].course, 
          price:this.props.profile.tutor[i].price});
      }
      
      const filteredCourses = [];
      for (let i=0;i<this.props.courses.length;i++) {
        if (ids.includes(this.props.courses[i].course_id)){
          const priceItems = prices.find(priceItem => {
            return (priceItem.id === this.props.courses[i].course_id);});
          filteredCourses.push({course:this.props.courses[i], price:priceItems.price});
        }
      }

      this.setState({
        tutorCourseIds: ids,
        tutorCoursePrices: prices,
        tutorCourses: filteredCourses
      }); 
    }

    //update state on going to profile page
    componentDidMount() {
      this.setStateCourses();
    }

    //update state in case a course is added or removed (check prev props)
    componentDidUpdate(prevProps) {
      //update state in case profile was null. in that case can't check tutor length
      if(this.props.profile !== null) {
        if(prevProps.profile === null) {
          this.setStateCourses();
        } else if(prevProps.profile.tutor.length !== this.props.profile.tutor.length){
          this.setStateCourses();
        }
      }
    }

    removeClick(id) {
      this.props.removeTutor(id);
      this.props.getProfile();
    }

    // add tutor form functions //

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
        for (let i=0; i < this.props.profile.tutor.length; i++) {
            if (this.props.profile.tutor[i].course === id) {
                return true;
            }
        }
        return false;
    };

    courseMutualExclusion = (id) => {
        for (let i=0; i < this.props.profile.student.length; i++) {
            if (this.props.profile.student[i].course === id) {
                return true;
            }
        }
        return false;
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        if (this.state.course_dept === "" || this.state.course_num === "" || this.state.course_price === "") {
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
        if(this.props.profile.tutor.length >= 5) {
            this.props.createMessage({ tooManyCourses: "You can have maximum 5 courses listed"});
            return;
        }
        if (id !== -1 || parseFloat(this.state.course_price > 1)) {
            this.props.addTutor(id, parseFloat(this.state.course_price));
            this.setState({
            course_id: -1,
            course_dept: "",
            course_num: "",
            course_title: "",
            course_price: "",
            });
            this.props.getProfile();
        }
        else {
            this.props.createMessage({ courseNotFound: "Please ensure you have entered course details correctly" });
        }
    };

    // end add tutor form functions //

    // edit tutor price functions //
    _handleFocusOut(course_id, price) {
        try {
            let new_price = parseFloat(price);
            if(!new_price || new_price < 0 || new_price > 999) {
                this.props.createMessage({ invalidPrice: "Changes not saved. Invalid price." });
                return;
            } else {
                this.props.updateTutorPrice(course_id, new_price);
                this.props.getProfile();
                return;
            }
        } catch {
            this.props.createMessage({ invalidPrice: "Changes not saved. Invalid price." });
            return;
        }
    }

    render() {
        const { course_id, course_dept, course_title, course_num, course_price } = this.state;

        // row in table for adding entries. Only shows up if less than 5 courses listed
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
            <input
                className="form-control"
                type="number"
                name="course_price"
                onChange={this.onChange}
                value={course_price}
                />
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
            { this.state.tutorCourses === undefined || this.state.tutorCourses.length === 0 ? 
            noCoursesMessage : null }
            <table style={{verticalAlign:'middle'}} className="table table-striped">
                <thead>
                <tr>
                    <th>Department</th>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Price/Hour <span style={{fontWeight:"lighter"}}>(click price to edit)</span></th>
                    <th />
                </tr>
                </thead>
                <tbody>
                { this.state.tutorCourses.map(courseObj => (
                    <tr key={courseObj.course.course_id} >
                    <td>{courseObj.course.course_dept}</td>
                    <td>{courseObj.course.course_num}</td>
                    <td>{courseObj.course.course_title}</td>
                    <td>
                    <div>
                    <EditableLabel text={courseObj.price}
                        labelClassName='priceLabelClass'
                        inputClassName='priceInputClass'
                        inputWidth='200px'
                        inputHeight='25px'
                        inputMaxLength='6'
                        labelFontWeight='regular'
                        inputFontWeight='bold'
                        onFocus={this._handleFocus}
                        onFocusOut={this._handleFocusOut.bind(this, courseObj.course.course_id)}
                    />
                    </div>
                    </td>
                    <td>
                        <button
                        onClick={this.removeClick.bind(this, courseObj.course.course_id)}
                        className="btn btn-danger btn-sm"
                        >
                        {" "}
                        Remove
                        </button>
                    </td>
                    </tr>
                ))}
                { this.state.tutorCourses.length < 5 ? formRow : null }
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

export default connect(mapStateToProps, { createMessage, addTutor, removeTutor, updateTutorPrice, getProfile })(TutorList);