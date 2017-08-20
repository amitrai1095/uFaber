// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class ServerSyncComponent extends Component {
	constructor(){
		super()
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

		window.setServerSyncCompleteIndicator = function(){
			_.bar.stop()
			_.bar.set(1.0)
		}
	}

	initSync(e){
		initServerSync()
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

	render() {
		return (
			<div className="container support-container no-left-padding">
				<div className="col-md-12">
					<div className="col-md-1 course-card-left-container videoDownloadLoader">
						<div ref="downloadLoader"></div>
					</div>
					
					<div className="col-md-7 no-left-padding col-md-offset-1">
						<h3 className="server-sync-text">Your app is connected to UPSC Pathshala Server</h3>
					</div>

					<div className="col-md-4 no-left-padding server-sync-btn-container">
						<button className="server-sync-btn" onClick={this.initSync.bind(this)}>SYNC NOW</button>
					</div>
				</div>
			</div>
		);
	}
}