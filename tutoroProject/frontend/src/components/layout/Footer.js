import React, { Component } from 'react'

export class Footer extends Component {

    render() {
        return (
            <nav style={{position:'fixed', width:'100%', bottom:'0', display:'flex', justifyContent:'center'}} className="navbar navbar-light bg-light">
                <p className="form-inline my-2">
                    This is a demo. &nbsp;<a href="https://github.com/sina-jamshidi/tutoroPublic" target="_blank"><i className="fab fa-github"></i></a>
                </p>
            </nav>
        );
    }
}

export default Footer;
