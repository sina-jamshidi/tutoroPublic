import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changePassword } from '../../actions/auth';
import { createMessage } from '../../actions/messages';

export class PasswordChange extends Component {
    state = {
        old_password: '',
        new_password1: '',
        new_password2: ''
    };

    static propTypes = {
      changePassword: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
      e.preventDefault();
      // validation
      const { old_password, new_password1, new_password2 } = this.state;
      if (new_password1 !== new_password2) {
        this.props.createMessage({ passwordsNotMatch: "Passwords do not match" });
      } else if (old_password == "" || new_password1 == "" || new_password2 == ""){
        this.props.createMessage({ allFieldsRequired: "All fields are required" });
      } else if (new_password1.length < 6) {
        this.props.createMessage({ longerPassword: "Password must be at least 6 characters long"});
      } else {
        // const newPassword = {
        //   old_password,
        //   new_password:new_password1,
        // };
        // this.props.changePassword(newPassword);
        this.props.createMessage({ demoPasswordMessage: "Password change functionality disabled for demo."});
      }
  };


    onChange = e => this.setState({
        [e.target.name] : e.target.value
    });


    render() {
        const { old_password, new_password1, new_password2 } = this.state;
        return (
          <div className="col-md-6 m-auto">
          <div className="card card-body mt-5">
            <h2 className="text-center">Choose New Password</h2>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="old_password"
                  onChange={this.onChange}
                  value={old_password}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password1"
                  onChange={this.onChange}
                  value={new_password1}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password2"
                  onChange={this.onChange}
                  value={new_password2}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { changePassword, createMessage })(PasswordChange);
