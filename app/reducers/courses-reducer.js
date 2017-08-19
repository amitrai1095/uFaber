import { ActionTypes } from '../actions'

let init = {
	courses: []
}

export default function dataReducer(state = init, action){
	try{
		switch(action.type){
			case ActionTypes.LOADING_COURSES:
				return{
					...state
				}

			case ActionTypes.LOADED_COURSES:
				let responseData = []
				responseData.push(action.payload)
				return{
					...state,
					courses: responseData
				}
		}
	}
	catch(e){
		console.error(e.message)
	}

	return state
}