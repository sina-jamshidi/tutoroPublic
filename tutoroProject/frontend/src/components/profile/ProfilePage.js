import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import TutorForm from './TutorForm';
import TutorList from './TutorList';
import PasswordChange from '../accounts/PasswordChange';
import { getProfile } from '../../actions/profile';

export class ProfilePage extends Component {
    static propTypes = {
        getProfile: PropTypes.func.isRequired,
        profile: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getProfile();
    }

    render() {
        return (
            <div>
                <h1>Welcome</h1>
                <h2>Change your password:</h2>
                <PasswordChange />
                <h2>Courses you need a tutor for:</h2>
                <StudentList />
                <StudentForm />
                <h2>Courses you can tutor:</h2>
                <TutorList />
                <TutorForm />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfile })(ProfilePage)
