import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { getProfile } from '../../actions/profile';
import FindStudents from '../../components/matches/FindStudents';
import FindTutor from '../../components/matches/FindTutor';

//TODO: sort the listings
export class Dashboard extends Component {

    static propTypes = {
        profile: PropTypes.object,
        getProfile: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getProfile();
    }

    render() {

        return (
            <Fragment>
                <Tabs className="justify-content-center my-2" defaultActiveKey="findStudent" id="matchTabs">
                    <Tab eventKey="findStudent" title="Find Students">
                        <FindStudents />
                    </Tab>
                    <Tab eventKey="findTutor" title="Find Tutors">
                        <FindTutor />
                    </Tab>
                </Tabs>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
})

export default connect(mapStateToProps, { getProfile })(Dashboard);