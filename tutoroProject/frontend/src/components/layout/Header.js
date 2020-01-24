import React, { Component } from 'react'
import { Button, Dropdown } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
                <form className="form-inline my-2 my-lg-0">
                    <span className="navbar-text mr-3">
                        <Link to='/profile'>
                        <Button variant="outline-dark">{user ? `Hi ${user.first_name}` : "" }</Button>    
                        </Link>
                    </span>
                    <Button onClick={this.props.logout} variant="outline-primary">Logout</Button>
                </form>
        );

        const guestLinks = (
            <form className="form-inline my-2 my-lg-0">
                <span className="navbar-text mr-3">
                <Link to='/register'>
                    <Button variant="outline-success">Get Started</Button>
                </Link>
                </span>
                <Link to='/login'>
                    <Button variant="outline-primary">Login</Button>
                </Link>
            </form>
        );

        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to ='/'><a className="navbar-brand" href="#">Tutoro</a></Link>
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to='/'><a className="nav-link" href="#">Matches</a></Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link to='/profile'><a className="nav-link" href="#">Profile</a></Link>
                        </li> */}
                        </ul>
                        { isAuthenticated ? authLinks : guestLinks }
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
