// This file contains the code for the card for each course

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class PlayerComponent extends Component {

	constructor(){
		super()
	}

	componentDidMount(){
		let videoUrl = this.props.videoUrl
		initApp(videoUrl)
	}
	
	render() {
		return (
			<div className="container">
				<div className="col-md-12">
					<video id="videoPlayer" className="player" controls></video>
				</div>
				<div className="col-md-12">
					<p className="video-description">
						<span className="video-description-title">Description : </span>
						<span className="video-description-text">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
						</span>
					</p>
				</div>
			</div>
		);
	}
}