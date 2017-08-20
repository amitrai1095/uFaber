// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class About extends Component {
	constructor(){
		super()
	}

	render() {
		return (
			<div className="container navbar-container no-left-padding about-container">
				<div className="col-md-12 no-left-padding">
					<p className="about-us-text">Welcome to a whole new world of learning without any constraint of time and location. Learn from the best experts of the industry and immerse into a rich experience of learning online at ufaber.com. Get online self-paced or guided courses for career advancement, school/college studies and entrance exams or just for the knowledge.</p>
				</div>
			</div>
		);
	}
}