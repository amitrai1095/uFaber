// This file contains the code for the card for each course

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class UnitComponent extends Component {
	// On Clicking download button, add the unit Id to the downloads list and use that list for below
	// Important - Insert code here to check if the passed unit Id is currently in the downloads list. If yes, set the state as downloading
	constructor(){
		super()
		this.state = { 
			isDownloading : false,
			allVideosDownloaded : false,
			progress : 0
		}
	}

	componentDidMount(){
		if(checkIfUnitInDownloads(this.props.unit.id)){
			this.setState(previousState => {
	    		return { isDownloading : true }
	    	})
		}
	}

	navigate(id, title, e){
		this.props.goToVideos(id, title)
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.downloadedId.split('-')[0] === this.props.unit.id && nextProps.downloadedId.split('-')[1] === this.props.unit.courseId){
			let videosNotDownloaded = this.props.unit.videosNotDownloaded
			videosNotDownloaded = videosNotDownloaded - 1
			if(videosNotDownloaded === 0){
				this.setState(previousState => {
		    		return { 
		    			allVideosDownloaded : true,
		    			isDownloading : false
		    		}
		    	})
			}
			else{
				if(checkIfUnitInDownloads(this.props.unit.id)){
					let currentProgress = 0
					let totalVideosInDownloads = underscore.where(unitDownloadProgress, {unitId: this.props.unit.id}).length
					let downloadedVideosInDownloads = underscore.where(unitDownloadProgress, {unitId: this.props.unit.id, downloadInProgress: false}).length
					currentProgress = ((downloadedVideosInDownloads/totalVideosInDownloads)*100).toFixed(0)
					this.setState(previousState => {
			    		return { progress : currentProgress }
			    	})
				}
				else{
					this.setState(previousState => {
			    		return { isDownloading : false }
			    	})
				}
			}
		}
	}

	download(unitId, e){
		downloadUnit(unitId)
		this.setState(previousState => {
    		return { isDownloading : true }
    	})
	}

	render() {
		let { title, start_date, id } = this.props.unit

		return (
			<div className="col-md-12 course-card-container no-left-padding">
				<div className="col-md-1 course-card-left-container no-left-padding">
					<img src="assets/images/ring.png" className="course-card-ring"/>
				</div>

				<div className="col-md-9 course-card-center-container no-left-padding">
					<div className="col-md-12 no-left-padding">
						<h4 className="unit-card-title">{ title }</h4>
					</div>
				</div>

				<div className="col-md-1 unit-card-download-icon-container">
					<div className="col-md-12">
						{
							!this.state.isDownloading && !this.state.allVideosDownloaded && <img src="assets/images/download_darkbrown.png" className="course-card-right-arrow" onClick={this.download.bind(this, id)}/>
						}
						{
							this.state.isDownloading && <img src="assets/images/download_green.png" className="course-card-right-arrow"/>
						}
						{
							this.state.allVideosDownloaded && <img src="assets/images/doubble_tick.png" className="course-card-right-arrow"/>
						}
					</div>

					<div className="col-md-12 unit-card-download-percent-container">
						<p className="unit-card-download-percent">51%</p>
					</div>
				</div>

				<div className="col-md-1 course-card-right-container">
					<img src="assets/images/right_arrow.png" className="course-card-right-arrow" onClick={this.navigate.bind(this, id, title)}/>
				</div>
			</div>
		);
	}
}