// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class SupportComponent extends Component {
	constructor(){
		super()
	}

	componentDidMount(){

	}

	render() {
		return (
			<div className="container support-container no-left-padding">
				<div className="col-md-4 no-left-padding">
					<div className="col-md-12 support-left-container no-left-padding">
						<div className="col-md-10 col-md-offset-2">
							<div>
								<img src="assets/images/mail.png" />
								<span className="support-type-title">E-Mail</span>
							</div>
						</div>
						<div className="col-md-10 col-md-offset-2 support-info">
							<p>contact@ufaber.com</p>
						</div>
					</div>
				</div>

				<div className="col-md-4 no-left-padding">
					<div className="col-md-12 support-center-container no-left-padding">
						<div className="col-md-10 col-md-offset-2">
							<div>
								<img src="assets/images/whatsapp.png" />
								<span className="support-type-title">Whatsapp Number</span>
							</div>
						</div>
						<div className="col-md-10 col-md-offset-2 support-info">
							<p>+91 8433971759</p>
						</div>
					</div>
				</div>

				<div className="col-md-4 no-left-padding">
					<div className="col-md-12 support-right-container no-left-padding">
						<div className="col-md-10 col-md-offset-2">
							<div>
								<img src="assets/images/website.png" />
								<span className="support-type-title">Website</span>
							</div>
						</div>
						<div className="col-md-10 col-md-offset-2 support-info">
							<p>www.ufaber.com</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}