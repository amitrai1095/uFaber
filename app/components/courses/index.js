// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'
import CourseComponent from './Course'

export default class CoursesComponent extends Component {
	constructor(){
		super()
		this.state = {
			emailSet : false
		}
	}

	componentDidMount(){
	}

	componentDidUpdate(){
		if(!this.state.emailSet && this.props.userEmail.length > 0){
			this.props.getCourses({
				email : this.props.userEmail
			})
			this.setState(previousState => {
				return {
					emailSet: true
				}
			})
		}
	}

	goToUnits(courseId, courseTitle, e){
		this.props.showUnits(courseId, courseTitle)
	}

	render() {
		let courses = this.props.coursesReducer.courses

		return (
			<div>
				{
					courses.map((items, rKey) => (
						<div key={rKey} className="container">
							{
								items.map((course, cKey) => {
									return (
										<CourseComponent key={cKey} course={course} goToUnits = {this.goToUnits.bind(this)} />
									)
								})	
							}
						</div>		
					))
				}
				<div className="container-fluid">
					<div className="col-md-12">
						<h5 className="app-download-text">Download our app</h5>
					</div>

					<div className="col-md-12 app-download-banner-container">
						<img className="app-download-banner" src="assets/images/googleplay_button.png" />
					</div>
				</div>
			</div>
		);
	}
}