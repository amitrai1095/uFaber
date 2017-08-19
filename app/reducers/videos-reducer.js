import { ActionTypes } from '../actions'

let init = {
	videos: []
}

export default function dataReducer(state = init, action){
	try{
		switch(action.type){
			case ActionTypes.LOADING_VIDEOS:
				return{
					...state
				}

			case ActionTypes.LOADED_VIDEOS:
				let responseData = []
				responseData.push(action.payload)
				return{
					...state,
					videos: responseData
				}
		}
	}
	catch(e){
		console.error(e.message)
	}

	return state
}