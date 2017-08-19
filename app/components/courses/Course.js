// This file contains the code for the card for each course

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class CourseComponent extends Component {

	navigate(id, title, e){
		this.props.goToUnits(id, title)
	}

	render() {
		let { title, start_date, id, resourceCount } = this.props.course

		return (
			<div className="col-md-12 course-card-container no-left-padding">
				<div className="col-md-1 course-card-left-container no-left-padding">
					<img src="assets/images/ring.png" className="course-card-ring"/>
				</div>

				<div className="col-md-9 course-card-center-container no-left-padding">
					<div className="col-md-12 no-left-padding">
						<h4 className="course-card-title">{ title }</h4>
					</div>

					<div className="col-md-12 no-left-padding course-card-center-lower-container">
						<div className="col-md-4 course-card-details-container no-left-padding">
							<p className="course-card-resources-text">{ resourceCount } Resources</p>
						</div>
						<div className="col-md-4 course-card-details-container no-left-padding">
							<p className="course-card-start-date-text">Start Date : { start_date }</p>
						</div>
						<div className="col-md-4 course-card-details-container no-left-padding">
							<p className="course-card-validity-text">Validity : { start_date }</p>
						</div>
					</div>
				</div>

				<div className="col-md-2 course-card-right-container">
					<img src="assets/images/right_arrow.png" className="course-card-right-arrow" onClick={this.navigate.bind(this, id, title)}/>
				</div>
			</div>
		);
	}
}