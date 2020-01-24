import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { createMessage } from '../../actions/messages';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resetPassword } from '../../actions/auth';

export class PasswordReset extends Component {
    state = {
        password: '',
        password2: '',
        redirect: false,
    };

    static propTypes = {
      resetPassword: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();
        // validation
        const { password, password2 } = this.state;
        if (password !== password2) {
          this.props.createMessage({ passwordsNotMatch: "Passwords do not match" });
        } else if (password == ""){
          this.props.createMessage({ allFieldsRequired: "All fields are required" });
        } else if (password.length < 6) {
          this.props.createMessage({ longerPassword: "Password must be at least 6 characters long"});
        } else {
          const newPass = {
            uid: this.props.id,
            token: this.props.token,
            new_password: password
          };
          this.props.resetPassword(newPass);
          this.setState({redirect: true});
        }
    };

    onChange = e => {
      this.setState({[e.target.name] : e.target.value});
    }

    render() {
        const { password, password2, redirect } = this.state;
        if (this.props.isAuthenticated) {
          return <Redirect to='/' />
        } else if (redirect) {
          return <Redirect to='/login' />
        }
        return (
            <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
              <h2 className="text-center">Choose New Password</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={this.onChange}
                    value={password}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password2"
                    onChange={this.onChange}
                    value={password2}
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Reset Password
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

export default connect(mapStateToProps, { resetPassword, createMessage })(PasswordReset);