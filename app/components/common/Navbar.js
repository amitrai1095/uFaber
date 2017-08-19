// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class Navbar extends Component {
	constructor(){
		super()
		this.state = {
			coursesClass : 'col-md-2 menu-option-active',
			aboutUsClass : 'col-md-2 menu-option-inactive',
			supportClass : 'col-md-2 menu-option-inactive',
			pendriveClass : 'col-md-3 menu-option-inactive',
			serverClass : 'col-md-3 menu-option-inactive'
		}
	}

	componentDidMount(){

	}

	resetStates(){
		this.setState(previousState => {
			return {
				coursesClass : 'col-md-2 menu-option-inactive',
				aboutUsClass : 'col-md-2 menu-option-inactive',
				supportClass : 'col-md-2 menu-option-inactive',
				pendriveClass : 'col-md-3 menu-option-inactive',
				serverClass : 'col-md-3 menu-option-inactive'
			}
		})
	}

	handleMenuItemClick(option, e){
		this.props.changeScreen(option)
		this.resetStates = this.resetStates.bind(this)
		this.resetStates()
		let _ = this
		switch(option){
			case 0:
				_.setState(previousState => {
				return {
						coursesClass : 'col-md-2 menu-option-active'
					}
				})
				break;
			case 1:
				_.setState(previousState => {
					return {
						supportClass : 'col-md-2 menu-option-active'
					}
				})
				break;
			case 2:
				_.setState(previousState => {
					return {
						aboutUsClass : 'col-md-2 menu-option-active'
					}
				})
				break;
			case 3:
				_.setState(previousState => {
					return {
						pendriveClass : 'col-md-3 menu-option-active'
					}
				})
				break;
			case 4:
				_.setState(previousState => {
					return {
						serverClass : 'col-md-3 menu-option-active'
					}
				})
				break;
		}
	}

	logout(e){
		logoutUser()
	}

	render() {
		return (
			<div className="container-fluid navbar-container no-left-padding">
				<div className="col-md-4 no-left-padding">
					<div className="col-md-4 navbar-user-photo-container no-left-padding">
						<img src="assets/images/user_profile.png" />
					</div>
					<div className="col-md-8 navbar-user-details-container no-left-padding">
						<p className="navbar-user-name">{ this.props.userName }</p>
						<p className="navbar-user-email">{ this.props.userEmail }</p>
					</div>
				</div>

				<div className="col-md-7">
					<div className={ this.state.coursesClass } onClick={ this.handleMenuItemClick.bind(this, 0) }>
						<div className="icon-wrapper">
							<img src="assets/images/my_courses.png" className="menu-option-icon" />
						</div>
						<p className="menu-option-name">My Courses</p>
					</div>
					<div className={ this.state.supportClass } onClick={ this.handleMenuItemClick.bind(this, 1) }>
						<div className="icon-wrapper">
							<img src="assets/images/support.png" className="menu-option-icon" />
						</div>
						<p className="menu-option-name">Support</p>
					</div>
					<div className={ this.state.aboutUsClass } onClick={ this.handleMenuItemClick.bind(this, 2) }>
						<div className="icon-wrapper">
							<img src="assets/images/about_us.png" className="menu-option-icon" />
						</div>
						<p className="menu-option-name">About Us</p>
					</div>
					<div className={ this.state.pendriveClass } onClick={ this.handleMenuItemClick.bind(this, 3) }>
						<div className="icon-wrapper">
							<img src="assets/images/pendrive_sync.png" className="menu-option-icon" />
						</div>
						<p className="menu-option-name">Pendrive Sync</p>
					</div>
					<div className={ this.state.serverClass } onClick={ this.handleMenuItemClick.bind(this, 4) }>
						<div className="icon-wrapper">
							<img src="assets/images/server_sync.png" className="menu-option-icon" />
						</div>
						<p className="menu-option-name">Server Sync</p>
					</div>
				</div>

				<div className="col-md-1 menu-logout-option" onClick={this.logout.bind(this)}>
					<div className="icon-wrapper">
						<img src="assets/images/logout.png" className="menu-option-icon" />
					</div>
					<p className="menu-option-name">Logout</p>
				</div>
			</div>
		);
	}
}