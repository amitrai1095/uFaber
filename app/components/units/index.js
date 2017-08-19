// The file presents a list of the units in a course

import React, {Component} from 'react'
import { Actions } from '../../actions'
import UnitComponent from './Unit'

export default class UnitsComponent extends Component {
	constructor(){
		super()
		this.state = { downloadedId : "" }
		setIsInUnitsFlag()
	}

	componentDidMount(){
		this.props.getUnits({
			"courseId": this.props.selectedCourseId,
			"userId": this.props.userId
		})
		let _ = this;
		window.updateUnitInterface = function(data){
			videosDb.find({
				url: data.url
			}, function(err, docs){
				let idData = docs[0].unitId + '-' + docs[0].courseId
				_.setState(previousState => {
		    		return { downloadedId : idData }
		    	})
			})
		}
	}

	componentDidUpdate(){

	}

	goToVideos(unitId, unitTitle, e){
		this.props.showVideos(unitId, unitTitle)
	}

	setCourseId(courseId){
		
	}

	render() {
		let units = this.props.unitsReducer.units

		return (
			<div>
				{
					units.map((items, rKey) => (
						<div key={rKey} className="container">
							{
								items.map((unit, cKey) => {
									return (
										<UnitComponent key={cKey} downloadedId={this.state.downloadedId} unit={unit} goToVideos = {this.goToVideos.bind(this)} />
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