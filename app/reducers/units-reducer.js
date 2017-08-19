import { ActionTypes } from '../actions'

let init = {
	units: []
}

export default function dataReducer(state = init, action){
	try{
		switch(action.type){
			case ActionTypes.LOADING_UNITS:
				return{
					...state
				}

			case ActionTypes.LOADED_UNITS:
				let responseData = []
				responseData.push(action.payload)
				return{
					...state,
					units: responseData
				}
		}
	}
	catch(e){
		console.error(e.message)
	}

	return state
}