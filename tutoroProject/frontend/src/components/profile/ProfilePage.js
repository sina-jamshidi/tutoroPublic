import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, Button, Card, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
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

    state = {
        runTutorial: false,
        steps: [
            {
                target: '.studentList',
                content: 'This is a list of courses that you have listed you need help with',
                placement:"top-start",
                disableBeacon:true
            },
            {
                target: '.studentForm',
                content: "You can add more here. There is a maximum of 5 courses you can list",
                placement:"top-start",
                disableBeacon:true
            },
            {
                target: '.tutorList',
                content: "Similar to above, but these courses are ones you feel comfortable tutoring!",
                placement:"top-start",
                disableBeacon:true
            }
        ]
    }

    startTutorial = () => {
        let run = !this.state.runTutorial;
        this.setState({
            runTutorial: true
        })
    }

    render() {
        const { runTutorial, steps } = this.state;

        return (
            <div>
                <div className="my-2"><Button variant="light" onClick={this.startTutorial}>Take Tour</Button></div>
                <Joyride steps={steps} run={runTutorial} />
                <h1>Welcome</h1>
                <h2>Change your password:</h2>
                <PasswordChange />
                <Accordion className="my-2" defaultActiveKey="1">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Demo Only - Possible Courses To Choose From
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <ListGroup>
                                    <ListGroup.Item>MATH 151</ListGroup.Item>
                                    <ListGroup.Item>CMPT 120</ListGroup.Item>
                                    <ListGroup.Item>MACM 201</ListGroup.Item>
                                    <ListGroup.Item>PSYC 221</ListGroup.Item>
                                    <ListGroup.Item>PSYC 303</ListGroup.Item>
                                    <ListGroup.Item>PSYC 325</ListGroup.Item>
                                    <ListGroup.Item>PSYC 330</ListGroup.Item>
                                    <ListGroup.Item>PSYC 387</ListGroup.Item>
                                    <ListGroup.Item>CMPT 300</ListGroup.Item>
                                    <ListGroup.Item>CMPT 412</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <h2>Courses you need a tutor for:</h2>
                <div className="studentList">
                <StudentList />
                </div>
                <div className="studentForm">
                <StudentForm />
                </div>
                <h2>Courses you can tutor:</h2>
                <div className="tutorList">
                <TutorList />
                </div>
                <TutorForm />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfile })(ProfilePage)
