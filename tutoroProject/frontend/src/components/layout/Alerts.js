import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
    }

    componentDidUpdate(prevProps){
        const { error, alert, message } = this.props;
        if(error !== prevProps.error) {
            //not sure this'll work: iterate through error keys and display them
            // const values = Object.values(error.msg)
            // for (const value of values) {
            //     alert.error(value.join());
            // }
            if (error.msg.username) {
                alert.error(error.msg.username.join());
            }
            if (typeof error.msg === "string" && error.msg.length > 30 && 
            error.msg.slice(0,31) === "DoesNotExist at /api/auth/login") {
                alert.error("Account with these credentials not found")
            }
        }

        if(message !== prevProps.message) {
            //not sure this'll work: iterate through error keys and display them
            // const keys = Object.keys(message)
            // for (const key of keys) {
            //     alert.show(message.key);
            // }
            // alert.show("there's a message!")
            //TODO: maybe, specify which errors, and customize text
            if (message.passwordsNotMatch) {
                alert.error(message.passwordsNotMatch);
            }
            if (message.allFieldsRequired) {
                alert.error(message.allFieldsRequired);
            }
            if (message.longerPassword) {
                alert.error(message.longerPassword);
            }
            if (message.nameAlpha) {
                alert.error(message.nameAlpha);
            }
            if (message.nameLong) {
                alert.error(message.nameLong);
            }
            if (message.passwordRequestSent) {
                alert.success(message.passwordRequestSent);
            }
            if (message.accountCreated) {
                alert.success(message.accountCreated);
            }
            if (message.emailVerified) {
                alert.success(message.emailVerified);
            }
            if (message.resetPasswordSuccess) {
                alert.success(message.resetPasswordSuccess);
            }
            if (message.courseAdded) {
                alert.success(message.courseAdded);
            }
            if (message.courseRemoved) {
                alert.success(message.courseRemoved);
            }
            if (message.courseNotFound) {
                alert.error(message.courseNotFound);
            }
            if (message.courseDuplicate) {
                alert.error(message.courseDuplicate);
            }
            if (message.mutualExclusion) {
                alert.error(message.mutualExclusion);
            }
            if (message.tooManyCourses) {
                alert.error(message.tooManyCourses);
            }
            if (message.demoRegistrationMessage) {
                alert.error(message.demoRegistrationMessage);
            }
            if (message.demoPasswordMessage) {
                alert.error(message.demoPasswordMessage);
            }
        }
    }

    render() {
        return <Fragment />;
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));
