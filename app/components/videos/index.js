// The file presents a list of the units in a course

import React, {Component} from 'react'
import { Actions } from '../../actions'
import VideoComponent from './Video'

export default class VideosComponent extends Component {
	constructor(){
		super()
		this.state = { 
			downloadedVideo : {
				url : "",
				localPath : ""
			},
			progress : {
				url : "",
				value : 0
			}
		}
		setIsInVideosFlag()
	}

	componentDidMount(){
		this.props.getVideos({
			'unitId': this.props.selectedUnitId,
			'courseId': this.props.selectedCourseId,
			'userId': this.props.userId
		})
		let _ = this;
		window.updateVideoInterface = function(data, option, localPath){
			if(option === 0){
				_.setState(previousState => {
		    		return { 
		    			downloadedVideo : {
		    				url: data.url,
			    			localPath: localPath
		    			}
		    		}
		    	})
			}
			else{
				_.setState(previousState => {
		    		return { 
		    			progress : {
		    				url : data.url,
		    				value : data.progress
		    			}
		    		}
		    	})
			}
		}
	}

	componentDidUpdate(){

	}

	goToPlayer(videoId, videoTitle, videoLocalPath, e){
		this.props.playVideo(videoId, videoTitle, videoLocalPath)
	}

	render() {
		let videos = this.props.videosReducer.videos

		return (
			<div>
				{
					videos.map((items, rKey) => (
						<div key={rKey} className="container">
							{
								items.map((video, vKey) => {
									return (
										<VideoComponent key={vKey} video={video} courseId={this.props.selectedCourseId} downloadProgress={this.state.progress} downloadedVideo={this.state.downloadedVideo} selectedUnitId={this.props.selectedUnitId} goToPlayer = {this.goToPlayer.bind(this)} />
									)
								})	
							}
						</div>		
					))
				}
			</div>
		);
	}
}