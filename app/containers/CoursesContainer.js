import React from 'react'
import {Link} from 'react-router-dom'

class CoursesContainer extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount(){
		let _ = this;
		window.updateInterface = function(){
			_.updateUI = _.updateUI.bind(_)
			_.updateUI()
		}
		hideLoadingScreen() // Function definition in handler.js
	}

	showDownloads(e){
		e.preventDefault()
		let videoUrl = "https://dl.pagal.link/upload_file/367/Bollywood%20Video%20Songs%20n%20Trailers/Bollywood%20Video%20Songs%20n%20Trailers%202017/Jab%20Harry%20Met%20Sejal%20%282017%29%20HD%20Video%20Songs/Safar%20-%20HD%20Video%20Song/SAFAR%20-%20Jab%20Harry%20Met%20Sejal%20%28HD%20720p%29.mp4"
		downloadVideo(videoUrl)
	}

	updateUI(){
		console.log('ui updated')
	}

	render() {
		return(
			<div>
				<h3>Courses Container</h3>
				<Link to="/" ><p>Home</p></Link>
				<Link to="/about" ><p>About</p></Link>
				<Link to="/course/unit" ><p>About</p></Link>
				<button onClick={ this.showDownloads.bind(this) }>Show Downloads</button>
				
				
				<button onclick="pause()">Pause</button>
			    <button onclick="initApp()">Load Video</button>
			</div>
		)
	}
}

export default CoursesContainer