import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Joyride from 'react-joyride';
import { getProfile } from '../../actions/profile';
import FindStudents from '../../components/matches/FindStudents';
import FindTutor from '../../components/matches/FindTutor';

//TODO: sort the listings
export class Dashboard extends Component {

    state = {
        runTutorial: false,
        steps: [
            {
                target: '.findStudentContainer',
                content: 'You can see matching students here, click the "get email" button to get their contact info!',
                placement:"top-start",
                disableBeacon:true
            },
            {
                target: '.profileButton',
                content: "Click here to go to your profile and edit your courses!",
                placement:"top",
                disableBeacon:true
            }
        ]
    }

    static propTypes = {
        profile: PropTypes.object,
        getProfile: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getProfile();
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
            <Fragment>
                <div className="my-2"><Button variant="light" onClick={this.startTutorial}>Take Tour</Button></div>
                <Joyride steps={steps} run={runTutorial} />
                <div>
                <Tabs className="justify-content-center my-2" defaultActiveKey="findStudent" id="matchTabs">
                    <Tab eventKey="findStudent" title="Find Students">
                        <FindStudents />
                    </Tab>
                    <Tab eventKey="findTutor" title="Find Tutors">
                        <FindTutor />
                    </Tab>
                </Tabs>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
})

export default connect(mapStateToProps, { getProfile })(Dashboard);