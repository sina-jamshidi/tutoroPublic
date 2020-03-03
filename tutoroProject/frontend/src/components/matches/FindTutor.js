import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TutorCard from './TutorCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { getTutors } from '../../actions/tutors';

//TODO: optimization. Make sure courseID's correspond to courses array index, no need to search
export class FindTutor extends Component {
    static propTypes = {
        tutors: PropTypes.array.isRequired,
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
    }

    state = {
        filters: [],
        selectedFilters: []
    } 

    getFilterCourses() {
        if(this.props.tutors.length === 0){
            return;
        }
        let courses = new Set();
        for (let i = 0; i < this.props.tutors.length; i++) {
            courses.add(this.props.tutors[i].course)
        }
        let filtersArr = [];
        for (let i = 0; i < this.props.courses.length; i++) {
            if(courses.has(this.props.courses[i].course_id)) {
                let label = `${this.props.courses[i].course_dept} ${this.props.courses[i].course_num}`;
                filtersArr.push({
                    value: this.props.courses[i].course_id,
                    label: label
                })
            }
        }
        this.setState({
            filters: filtersArr,
            selectedFilters : this.state.selectedFilters
        })
    }

    handleFilter = (selections) => {
        if (!selections) {
            this.setState({
                selectedFilters: []
            })
        } else {
            let values = selections.map(filterObj => (
                filterObj.value
            ))
            this.setState({
                selectedFilters: values
            })
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.tutors.length !== this.props.tutors.length){
            this.getFilterCourses();
        }
    }

    componentDidMount() {
        this.props.getTutors();
        this.getFilterCourses();
    }

    render() {

        const CustomClearText = () => 'clear all';

        const ClearIndicator = props => {
            const {
              children = <CustomClearText />,
              getStyles,
              innerProps: { ref, ...restInnerProps },
            } = props;
            return (
              <div
                {...restInnerProps}
                ref={ref}
                style={getStyles('clearIndicator', props)}
              >
                <div style={{ padding: '0px 5px' }}>{children}</div>
              </div>
            );
        };

        const ClearIndicatorStyles = (base, state) => ({
            ...base,
            cursor: 'pointer',
            color: state.isFocused ? 'blue' : 'black',
        });

        if ((this.props.tutors.length < 1) || (this.state.filters[0] < 1)) {
            return (
                <Fragment>
                    <p>
                        No matching tutor found. Make sure to add courses you need help with
                        in your profile.
                    </p>
                </Fragment>
            );
        } else {
            const filteredTutors = this.props.tutors.filter(tutorObj => (
                this.state.selectedFilters.includes(tutorObj.course) ||
                this.state.selectedFilters.length === 0
            ));
            return (
                <Fragment>
                    <Container className="findTutorContainer">
                        <Col>
                            <h3>Matching Tutors</h3>
                            <h5>Filters:</h5>
                            <Select
                            closeMenuOnSelect={false}
                            components={{ ClearIndicator }}
                            styles={{ clearIndicator: ClearIndicatorStyles }}
                            placeholder="Select to filter..."
                            onChange={this.handleFilter}
                            isMulti
                            options={this.state.filters}
                            />
                            {/* first sort the list by price, then display */}
                            {filteredTutors.sort((a, b) => 
                                parseFloat(a.price) - parseFloat(b.price))
                            .map((tutorObj, index, array) => (
                                <Row key={index} className="my-2">
                                <TutorCard tutor_index={index} course_id={tutorObj.course} />
                                </Row>
                            ))}
                        </Col>
                    </Container>
                </Fragment>
            );
        }
    }
}

const mapStateToProps = state => ({
    tutors: state.tutors.tutors,
    profile: state.profile.profile,
    courses: state.courses.courses,
})

export default connect(mapStateToProps, { getTutors })(FindTutor);
