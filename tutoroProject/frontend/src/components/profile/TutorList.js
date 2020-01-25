import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeTutor } from "../../actions/tutors";
import { getProfile } from "../../actions/profile";

//TODO: ability to edit price/hour
//TODO: right now doing 2 api calls to the same endpoint to get current tutoring and studying
export class TutorList extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
        removeTutor: PropTypes.func.isRequired,
        getProfile: PropTypes.func.isRequired,
    }
    
    state = {
      tutorCourseIds: [],
      tutorCoursePrices: [],
      tutorCourses: []
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
        }
      else if(prevProps.profile.tutor.length !== this.props.profile.tutor.length){
          this.setStateCourses();
        }
      }
    }

    removeClick(id) {
      this.props.removeTutor(id);
      this.props.getProfile();
    }

    render() {
      if (this.state.tutorCourses === undefined || this.state.tutorCourses.length === 0){
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
                  <th>Price/Hour</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                { this.state.tutorCourses.map(courseObj => (
                  <tr key={courseObj.course.course_id} >
                    <td>{courseObj.course.course_dept}</td>
                    <td>{courseObj.course.course_num}</td>
                    <td>{courseObj.course.course_title}</td>
                    <td>{courseObj.price}</td>
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

export default connect(mapStateToProps, { removeTutor, getProfile })(TutorList);