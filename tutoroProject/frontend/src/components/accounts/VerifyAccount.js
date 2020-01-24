import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createMessage } from '../../actions/messages';
import { verifyAccount } from '../../actions/auth';

export class VerifyAccount extends Component {
    componentDidMount(){
        var url = "http://127.0.0.1:8000/api/verify/"+this.props.id+"/"+this.props.token;
        this.props.verifyAccount(url)
    }

    static propTypes = {
      verifyAccount: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
    };

    render() {
        if(this.props.isAuthenticated) {
            this.props.createMessage({ emailVerified: "Email Verified!" });
            return <Redirect to="/" />;
        }
        return <p> Verifying...</p>;
    }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { verifyAccount, createMessage })(VerifyAccount);
