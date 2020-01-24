import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { createMessage } from '../../actions/messages';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';

export class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: ''
    };

    static propTypes = {
      register: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();
        // validation
        const { password, password2, first_name, username, email } = this.state;
        if (password !== password2) {
          this.props.createMessage({ passwordsNotMatch: "Passwords do not match" });
        } else if (password == "" || first_name == "" || username == ""){
          this.props.createMessage({ allFieldsRequired: "All fields are required" });
        } else if (password.length < 6) {
          this.props.createMessage({ longerPassword: "Password must be at least 6 characters long"});
        } else if (!(/^[A-Za-z\s]+$/.test(first_name))) {
          this.props.createMessage({ nameAlpha: "Names can only contain letters"});
        } else if (first_name.length > 20 || first_name.length < 2) {
          this.props.createMessage({ nameLong: "First name can only be between 2-20 letters long"});
        } else {
          // const newUser = {
          //   first_name,
          //   username,
          //   email,
          //   password
          // };
          // this.props.register(newUser);
          this.props.createMessage({ demoRegistrationMessage: "Registration functionality disabled for demo."});
          this.setState({
            username: '',
            email: '',
            password: '',
            password2: '',
            first_name: ''
          });
        }
    };

    onChange = e => {
        if (e.target.name == 'username') {
            this.setState({
                [e.target.name] : e.target.value,
                ['email'] : `${e.target.value}@sfu.ca`,
            });
        } else {
            this.setState({
                [e.target.name] : e.target.value
            });
        }
    }



    render() {
        const { first_name, username, email, password, password2 } = this.state;
        if (this.props.isAuthenticated) {
          return <Redirect to='/' />
        }
        return (
            <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
              <h2 className="text-center">Register</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    onChange={this.onChange}
                    value={first_name}
                  />
                </div>
                <div className="form-group">
                  <label>SFU Computing ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    onChange={this.onChange}
                    value={username}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={this.onChange}
                    value={email}
                    readOnly/>
                </div>
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
                <p>
                  By signing up you agree to our Terms of Use and Privacy Policy.
                </p>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        )
    }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register, createMessage })(Register);