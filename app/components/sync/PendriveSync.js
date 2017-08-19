// The file presents a list of the courses the User has registered

import React, {Component} from 'react'
import { Actions } from '../../actions'

export default class PendriveSyncComponent extends Component {
	constructor(){
		super()
	}

	componentDidMount(){
	}

	initSync(e){
		initPendriveSync()
	}

	render() {
		return (
			<div className="container support-container no-left-padding">
				<div className="col-md-12">
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