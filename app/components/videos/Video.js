// This file contains the code for the card for each course

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class VideoComponent extends Component {
	// On Clicking download button, add the unit Id to the downloads list and use that list for below
	// Important - Insert code here to check if the passed unit Id is currently in the downloads list. If yes, set the state as downloading
	constructor(){
		super()
		this.state = { 
			isDownloading : false,
			isDownloaded : false,
			progress : 0,
			localPath : ""
		}
	}

	componentDidMount(){
		this.bar = new ProgressBar.Circle(this.refs.downloadLoader, {
			strokeWidth: 3,
			easing: 'easeInOut',
			duration: 1000,
			color: '#0c9928',
			trailColor: '#0c9928',
			trailWidth: 0.3,
			svgStyle: null
		})

		if(checkIfVideoInDownloads(this.props.video.id)){
			this.setState(previousState => {
	    		return { isDownloading : true }
	    	})
	    	startDownloadLoader()
		}
		if(this.props.video.isDownloaded){
			this.setState(previousState => {
	    		return { 
	    			isDownloaded : true,
	    			isDownloading : false,
	    			localPath: this.props.video.localPath
	    		}
	    	})
	    	this.bar.set(1.0)
		}
	}

	navigate(id, videoTitle, localPath, e){
		if(this.state.isDownloaded){
			this.props.goToPlayer(id, videoTitle, this.state.localPath)
		}
		else{
			showAlert()
		}
	}

	download(videoId, e){
		addToDownloadQueue(videoId, this.props.video.url, this.props.selectedUnitId, this.props.courseId)
		this.setState(previousState => {
    		return { isDownloading : true }
    	})
    	startDownloadLoader()
	}

	startDownloadLoader(){
		let _ = this
		let z = 1.0;
		this.bar.animate(z);
		z = 0.0;
		setInterval(function(){
			_.bar.animate(z);
			if(z === 1.0){
				z = 0.0
			}
			else{
				z = 1.0
			}
		}, 2000)
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.downloadedVideo.url === this.props.video.url){
			this.setState(previousState => {
	    		return { 
	    			isDownloading : false,
	    			isDownloaded : true,
	    			localPath : nextProps.downloadedVideo.localPath
	    		}
	    	})
	    	this.bar.stop()
	    	this.bar.set(1.0)
		}

		if(nextProps.downloadProgress.url === this.props.video.url){
			this.setState(previousState => {
	    		return { 
	    			progress : nextProps.downloadProgress.value
	    		}
	    	})
		}
	}

	render() {
		let { title, start_date, id, duration, localPath } = this.props.video

		return (
			<div className="col-md-12 course-card-container no-left-padding">
				<div className="col-md-1 course-card-left-container videoDownloadLoader">
					<div ref="downloadLoader"></div>
				</div>

				<div className="col-md-9 course-card-center-container no-left-padding">
					<div className="col-md-12 no-left-padding">
						<h4 className="course-card-title">{ title }</h4>
					</div>

					<div className="col-md-12 no-left-padding course-card-center-lower-container">
						<div className="col-md-4 course-card-details-container no-left-padding">
							<p className="course-card-resources-text">Duration : { duration } minutes</p>
						</div>
					</div>
				</div>

				<div className="col-md-1 unit-card-download-icon-container">
					<div className="col-md-12">
						{
							!this.state.isDownloading && !this.state.isDownloaded && <img src="assets/images/download_darkbrown.png" className="course-card-right-arrow" onClick={this.download.bind(this, id)}/>
						}
						{
							this.state.isDownloading && <img src="assets/images/download_green.png" className="course-card-right-arrow"/>
						}
						{
							this.state.isDownloaded && <img src="assets/images/doubble_tick.png" className="course-card-right-arrow"/>
						}
					</div>

					<div className="col-md-12 unit-card-download-percent-container">
						<p className="unit-card-download-percent">51%</p>
					</div>
				</div>

				<div className="col-md-1 course-card-right-container">
					<img src="assets/images/right_arrow.png" className="course-card-right-arrow" onClick={this.navigate.bind(this, id, title, localPath)}/>
				</div>
			</div>
		);
	}
}