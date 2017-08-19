// Reducers output the Redux state (models) for the app. They do not alter the
// existing state, but generate modified state objects from the old state in
// response to actions.
//
// http://redux.js.org/docs/basics/Reducers.html
import { combineReducers } from 'redux'
import authReducer from './auth-reducer'
import coursesReducer from './courses-reducer'
import unitsReducer from './units-reducer'
import videosReducer from './videos-reducer'

// Root Reducer
export default combineReducers({
	authReducer,
	coursesReducer,
	unitsReducer,
	videosReducer
});
