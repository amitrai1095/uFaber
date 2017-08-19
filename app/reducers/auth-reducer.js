import { ActionTypes } from '../actions'

let init = {
	data: []
}

export default function dataReducer(state = init, action){
	try{
		switch(action.type){
			case ActionTypes.LOADING_USER:
				return{
					...state
				}

			case ActionTypes.LOADED_USER:
				let responseData = []
				responseData.push(action.payload)
				return{
					...state,
					data: responseData
				}
		}
	}
	catch(e){
		console.error(e.message)
	}

	return state
}