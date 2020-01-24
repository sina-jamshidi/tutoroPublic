import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StudentCard from './StudentCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { getStudents } from '../../actions/students';

export class FindStudents extends Component {
    static propTypes = {
        students: PropTypes.array.isRequired,
        courses: PropTypes.array.isRequired,
        profile: PropTypes.object,
    }

    state = {
        filters: [],
        selectedFilters: []
    } 

    getFilterCourses() {
        if(this.props.students.length === 0){
            return;
        }
        let courses = new Set();
        for (let i = 0; i < this.props.students.length; i++) {
            courses.add(this.props.students[i].course)
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
        if(prevProps.students.length !== this.props.students.length){
            this.getFilterCourses();
        }
    }


    componentDidMount() {
        this.props.getStudents();
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


        if ((this.props.students.length < 1) || (this.state.filters[0] < 1)) {
            return (
                <Fragment>
                    <p>
                        No matching students found. Make sure to add courses you can tutor
                        in your profile.
                    </p>
                </Fragment>
            );
        } else {
            const filteredStudents = this.props.students.filter(studentObj => (
                this.state.selectedFilters.includes(studentObj.course) ||
                this.state.selectedFilters.length === 0
            ))            
            return (
                <Fragment>
                    <Container>
                        <Col>
                            <h3>Matching Students</h3>
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
                            {filteredStudents.map((studentObj, index, array) => (
                            <Row key={index} className="my-2">
                            <StudentCard student_index={index} course_id={studentObj.course} />
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
    students: state.students.students,
    profile: state.profile.profile,
    courses: state.courses.courses,
})

export default connect(mapStateToProps, { getStudents })(FindStudents);
