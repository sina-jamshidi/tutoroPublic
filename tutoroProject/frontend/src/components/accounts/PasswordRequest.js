import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { createMessage } from '../../actions/messages';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { requestPassword } from '../../actions/auth';

export class PasswordRequest extends Component {
    state = {
        email: '',
    };

    static propTypes = {
      requestPassword: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();

        // this.props.requestPassword(this.state.email);

        // this.props.createMessage({ passwordRequestSent: "Email sent! Check for the reset link" });        
        this.props.createMessage({ demoPasswordMessage: "Password change functionality disabled for demo."});
    };

    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }



    render() {
        const { email } = this.state;
        if (this.props.isAuthenticated) {
          return <Redirect to='/' />
        }
        return (
            <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
              <h2 className="text-center">Request Password Reset</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={this.onChange}
                    value={email}
                    />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Request Password Reset
                  </button>
                </div>
                <p>
                  Remembered Your Password? <Link to="/login">Login</Link>
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

export default connect(mapStateToProps, { requestPassword, createMessage })(PasswordRequest);