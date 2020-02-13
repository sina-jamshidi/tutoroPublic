import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { addMatchStudent } from '../../actions/match';

// TODO: put same tutor looking for multiple courses on same card?
export class TutorCard extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        tutorItem: PropTypes.object,
        courseItem: PropTypes.object,
        addMatchStudent: PropTypes.func.isRequired,
    };

    state = {
        loadingEmail: false,
        email: null
    };

    componentDidUpdate(prevProps) {
        if(prevProps.match.emails.length !== this.props.match.emails.length)
        {
            // used for when get email button is clicked
            if (this.props.match.emails.length > 0) {
                for (let i = 0; i < this.props.match.emails.length; i++) {
                    if (this.props.match.emails[i].match_id === this.props.tutorItem.user.id) {
                        this.setState({
                            loadingEmail: false,
                            email: this.props.match.emails[i].email
                        });
                    }
                }
            }
        }
    }

    getEmail(match_id, course_id) {
        this.props.addMatchStudent(match_id, course_id);
    }

    render() {
        if(!this.props.tutorItem || !this.props.courseItem) {
            return(<Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>);
        } else {
            const { id, first_name } = this.props.tutorItem.user;
            const price = this.props.tutorItem.price;
            const match_id = id;
            const {course_id, course_num, course_dept, course_title} = this.props.courseItem;
            const courseName = `${course_dept} ${course_num}: ${course_title}`;
            let email;

            if(!this.state.email) {
                email = <Button variant="light" size="sm" 
                    onClick={this.getEmail.bind(this, match_id, course_id)}>
                Get Email</Button>;
            } else if (!this.state.email && this.loadingEmail) {
                email = <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span></Spinner>;
            } else {
                email = <div><Badge variant="light">{this.state.email}</Badge></div>;
            }

            return (
                <Card style={{ width: '100%' }}>
                <Card.Header as="h5">{courseName} - <strong>${price} per hour</strong></Card.Header>
                <Card.Body>
                    <Card.Title>Name: {first_name}</Card.Title>
                    <Card.Text>
                    {first_name} can help with {courseName}. 
                    Click the button to get user's email address.
                    </Card.Text>
                    {email}
                </Card.Body>
                </Card>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const tutorItem = state.tutors.tutors[ownProps.tutor_index];
    const course_id = ownProps.course_id;
    let courseItem;
    for (let i = 0; i < state.courses.courses.length; i++) {
        if (state.courses.courses[i].course_id === course_id) {
            courseItem = state.courses.courses[i];
        }
    }
    return {
        tutorItem: tutorItem,
        courseItem: courseItem,
        match: state.match
    }
}

export default connect(mapStateToProps, { addMatchStudent })(TutorCard);
