// This container is the parent screen which comes once the User logs In

import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { Actions } from '../actions'
import Navbar from '../components/common/Navbar'
import Breadcrumps from '../components/common/Breadcrumps'
import About from '../components/common/About'
import CoursesComponent from '../components/courses'
import UnitsComponent from '../components/units'
import VideosComponent from '../components/videos'
import PlayerComponent from '../components/videos/player'
import SupportComponent from '../components/support'
import ServerSyncComponent from '../components/sync/ServerSync'
import PendriveSyncComponent from '../components/sync/PendriveSync'

class HomeContainer extends React.Component {
	constructor(props){
		super(props)
		this.state = { 
			renderCoursesView : true,
			renderAboutView : false,
			renderUnitsView : false,
			renderVideosView : false,
			renderPlayerView : false,
			renderSupportView : false,
			renderPendriveSyncView : false,
			renderServerSyncView : false,
			selectedCourseId : "",
			selectedUnitId : "",
			videoUrl : "",
			userId : "",
			userEmail : "",
			userName : ""
		}
	}

	componentDidMount(){
		let _ = this
		userDb.find({}, function(err, docs){
			if(err){
				console.log(err)
			}
			if(docs.length > 0){
				_.setState(previousState => {
					return {
						userId : docs[0].id,
						userEmail : docs[0].email,
						userName : docs[0].name
					}
				})
			}
		})

		window.navigateToLogin = function(data){
			_.goToLoginScreen = _.goToLoginScreen.bind(_)
			_.goToLoginScreen()
		}
	}

	componentDidUpdate(){

	}

	resetStates(){
		this.setState(previousState => {
    		return { 
    			renderCoursesView : false,
    			renderAboutView : false
				renderUnitsView : false,
				renderVideosView : false,
				renderPlayerView : false,
				renderSupportView : false,
				renderPendriveSyncView : false,
				renderServerSyncView : false
    		}
    	})
	}

	goToLoginScreen(){
		console.log('coming')
		this.props.history.push('/');
	}

	changeScreen(selectedOption, e){
		this.resetStates = this.resetStates.bind(this)
		this.resetStates()
		switch(selectedOption){
			case 0:
				this.setState(previousState => {
		    		return { renderCoursesView : true }
		    	})
		    	this.refs.breadcrump.resetBreadcrumps()
		    	this.refs.breadcrump.setCoursesBreadcrump()
				break;
			case 1:
				this.setState(previousState => {
		    		return { renderSupportView : true }
		    	})
		    	this.refs.breadcrump.resetBreadcrumps()
		    	this.refs.breadcrump.setSupportBreadcrump()
				break;
			case 2:
				this.setState(previousState => {
					return { renderAboutView : true }
				})
		    	this.refs.breadcrump.resetBreadcrumps()
		    	this.refs.breadcrump.setAboutBreadcrump()
				break;
			case 3:
				this.setState(previousState => {
		    		return { renderPendriveSyncView : true }
		    	})
		    	this.refs.breadcrump.resetBreadcrumps()
		    	this.refs.breadcrump.setPendriveSyncBreadcrump()
				break;
			case 4:
				this.setState(previousState => {
		    		return { renderServerSyncView : true }
		    	})
		    	this.refs.breadcrump.resetBreadcrumps()
		    	this.refs.breadcrump.setServerSyncBreadcrump()
				break;

		}
	}

	showUnits(courseId, courseTitle, e){
		const selectedCourseId = courseId
		const selectedCourseTitle = courseTitle
		this.resetStates = this.resetStates.bind(this)
		this.resetStates()
		this.setState(previousState => {
    		return { 
    			renderUnitsView : true,
    			selectedCourseId : courseId
    		}
    	})
    	this.refs.breadcrump.setUnitBreadcrump(courseTitle)
	}

	showVideos(unitId, unitTitle, e){
		const selectedUnitId = unitId
		this.resetStates = this.resetStates.bind(this)
		this.resetStates()
		this.setState(previousState => {
    		return { 
    			renderVideosView : true,
    			selectedUnitId : unitId
    		}
    	})
    	this.refs.breadcrump.setVideoBreadcrump(unitTitle)
	}

	playVideo(videoId, videoTitle, videoLocalPath, e){
		const selectedVideoId = videoId
		this.resetStates = this.resetStates.bind(this)
		this.resetStates()
		this.setState(previousState => {
    		return { 
    			renderPlayerView : true,
    			videoUrl : videoLocalPath
    		}
    	})
    	this.refs.breadcrump.setPlayerBreadcrump(videoTitle)
	}

	navigateThroughBreadcrumps(option, e){
		switch(option){
			case 0:
				this.resetStates()
				this.setState(previousState => {
		    		return { renderCoursesView : true }
		    	})
				break;
			case 1:
				this.resetStates()
				this.setState(previousState => {
		    		return { renderUnitsView : true }
		    	})
				break;
			case 2:
				this.resetStates()
				this.setState(previousState => {
		    		return { renderVideosView : true }
		    	})
				break;
		}
	}

	render() {
		return(
			<div className="home-container">
				<Navbar changeScreen={this.changeScreen.bind(this)} userName={this.state.userName} userEmail={this.state.userEmail} goToLoginScreen={this.goToLoginScreen.bind(this)} />
				<Breadcrumps ref="breadcrump" navigateThroughBreadcrumps={this.navigateThroughBreadcrumps.bind(this)} />
				<div className="home-content">
					{
						this.state.renderCoursesView && <CoursesComponent {...this.props} userEmail={this.state.userEmail} showUnits={this.showUnits.bind(this)} />
					}
					{
						this.state.renderUnitsView && <UnitsComponent userId={this.state.userId} selectedCourseId={ this.state.selectedCourseId } {...this.props} showVideos={this.showVideos.bind(this)} />
					}
					{
						this.state.renderVideosView && <VideosComponent userId={this.state.userId} selectedCourseId={ this.state.selectedCourseId } selectedUnitId={ this.state.selectedUnitId } {...this.props} playVideo={this.playVideo.bind(this)} />
					}
					{
						this.state.renderPlayerView && <PlayerComponent videoUrl={ this.state.videoUrl } />
					}
					{
						this.state.renderSupportView && <SupportComponent />
					}
					{
						this.state.renderAboutView && <About />
					}
					{
						this.state.renderServerSyncView && <ServerSyncComponent />
					}
					{
						this.state.renderPendriveSyncView && <PendriveSyncComponent />
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps (state, props) {
  return state;
}

export default connect(mapStateToProps, Actions)(HomeContainer)