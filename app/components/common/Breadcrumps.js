import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class Breadcrumps extends Component {
	constructor(){
		super()
		this.state = { 
			coursesBreadcrump: true,
			supportBreadcrump: false,
			pendriveSyncBreadcrump: false,
			serverSyncBreadcrump: false,
			aboutUstBreadcrump: false,
			shouldResetCoursesChildCrumps: false, // Tells whether or not to hide crumps indicating unit, videos etc.
			clickableIndex: -1 // Indicates the index upto which breadcrumps can be used to go back to previous page
		}
	}

	componentDidMount(){
    	this.refs.breadcrump2.style.opacity = 0
    	this.refs.breadcrump3.style.opacity = 0
    	this.refs.breadcrump4.style.opacity = 0
    	this.refs.arrow1.style.opacity = 0
    	this.refs.arrow2.style.opacity = 0
    	this.refs.arrow3.style.opacity = 0
	}

	resetBreadcrumps(){
		this.setState(previousState => {
    		return { 
    			coursesBreadcrump: false,
				supportBreadcrump: false,
				pendriveSyncBreadcrump: false,
				serverSyncBreadcrump: false
    		}
    	})
	}

	setCoursesBreadcrump(){
		this.setState(previousState => {
    		return { 
    			coursesBreadcrump: true,
    			shouldResetCoursesChildCrumps: true,
    			clickableIndex: -1
    		}
    	})
	}

	componentDidUpdate(){
		if(this.state.coursesBreadcrump && this.state.shouldResetCoursesChildCrumps){
			this.refs.breadcrump2.style.opacity = 0
	    	this.refs.breadcrump3.style.opacity = 0
	    	this.refs.breadcrump4.style.opacity = 0
	    	this.refs.arrow1.style.opacity = 0
	    	this.refs.arrow2.style.opacity = 0
	    	this.refs.arrow3.style.opacity = 0
	    	this.setState(previousState => {
	    		return {
	    			shouldResetCoursesChildCrumps: false
	    		}
	    	})
		}
	}

	setUnitBreadcrump(courseTitle){
		this.setState(previousState => {
    		return {
    			coursesBreadcrump: true,
    			clickableIndex: 0
    		}
    	})
    	this.refs.breadcrump2.style.opacity = 1
    	this.refs.arrow1.style.opacity = 1
    	this.refs.breadcrump2.innerHTML = courseTitle
	}

	setVideoBreadcrump(unitTitle){
		this.setState(previousState => {
    		return { 
    			coursesBreadcrump: true,
    			clickableIndex: 1
    		}
    	})
    	this.refs.breadcrump3.style.opacity = 1
    	this.refs.arrow2.style.opacity = 1
    	this.refs.breadcrump3.innerHTML = unitTitle
	}

	setPlayerBreadcrump(videoTitle){
		this.setState(previousState => {
    		return { 
    			coursesBreadcrump: true,
    			clickableIndex: 2
    		}
    	})
    	this.refs.breadcrump4.style.opacity = 1
    	this.refs.arrow3.style.opacity = 1
    	this.refs.breadcrump4.innerHTML = videoTitle
	}

	setSupportBreadcrump(){
		this.setState(previousState => {
    		return { 
    			supportBreadcrump: true
    		}
    	})
	}

	setAboutBreadcrump(){
		this.setState(previousState => {
    		return { 
    			aboutUstBreadcrump: true
    		}
    	})
	}

	setPendriveSyncBreadcrump(){
		this.setState(previousState => {
    		return { 
    			pendriveSyncBreadcrump: true
    		}
    	})
	}

	setServerSyncBreadcrump(){
		this.setState(previousState => {
    		return { 
    			serverSyncBreadcrump: true
    		}
    	})
	}

	goToPreviousPage(option, e){
		switch(option){
			case 0:
				if(this.state.clickableIndex >= 0){
					this.refs.breadcrump2.style.opacity = 0
					this.refs.arrow1.style.opacity = 0
					this.refs.breadcrump3.style.opacity = 0
					this.refs.arrow2.style.opacity = 0
					this.refs.breadcrump4.style.opacity = 0
					this.refs.arrow3.style.opacity = 0
				}
				break
			case 1:
				if(this.state.clickableIndex >= 1){
					this.refs.breadcrump3.style.opacity = 0
					this.refs.arrow2.style.opacity = 0
					this.refs.breadcrump4.style.opacity = 0
					this.refs.arrow3.style.opacity = 0
				}
				break
			case 2:
				if(this.state.clickableIndex >= 2){
					this.refs.breadcrump4.style.opacity = 0
					this.refs.arrow3.style.opacity = 0
				}
				break
		}
		this.props.navigateThroughBreadcrumps(option)
	}

	render() {
		return (
			<div className="container breadcrumps-container">
				<p className="breadcrump-text">
					{
						this.state.coursesBreadcrump &&
						<div>
							<span className="breadcrump-part-1" onClick={this.goToPreviousPage.bind(this, 0)}>My Courses</span>
							<img className="breadcrump-arrow" ref="arrow1" src="assets/images/right_arrow.png" />
							<span className="breadcrump-part-n" ref="breadcrump2" onClick={this.goToPreviousPage.bind(this, 1)}>Package</span>
							<img className="breadcrump-arrow" ref="arrow2" src="assets/images/right_arrow.png" />
							<span className="breadcrump-part-n" ref="breadcrump3" onClick={this.goToPreviousPage.bind(this, 2)}>Package</span>
							<img className="breadcrump-arrow" ref="arrow3" src="assets/images/right_arrow.png" />
							<span className="breadcrump-part-n" ref="breadcrump4">Package</span>
						</div>
					}
					{
						this.state.supportBreadcrump &&
						<span className="breadcrump-part-1">Support</span>
					}
					{
						this.state.aboutUstBreadcrump &&
						<span className="breadcrump-part-1">About Us</span>
					}
					{
						this.state.pendriveSyncBreadcrump &&
						<span className="breadcrump-part-1">Pendrive Sync</span>
					}
					{
						this.state.serverSyncBreadcrump &&
						<span className="breadcrump-part-1">Server Sync</span>
					}
				</p>
			</div>
		);
	}
}