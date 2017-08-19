import { call, put } from 'redux-saga/effects';
import { Actions, ActionTypes } from '../actions';


const DEFAULTS = {
  q: ""
};

export default [
  [ActionTypes.GET_COURSES, getCourses],
];


export function* getCourses({payload}){
	let email = payload.email
	yield put(Actions.loadingCourses())

	const request = require('request')
	const fetchUser = () => new Promise((resolve, reject) => {
		coursesDb.find({}, function(err, courses){
			if(err || courses.length === 0){
				let coursesAPI = "http://api.ufaber.com/api/package/"+ email +"/"
				request(coursesAPI, function(err, response, body){
					let resolvedCourses = []
					let result = JSON.parse(body)
					if(result.context){
						let iterate = true
						let index = 0
						let length = result.context.length
						let fetchedCourses = result.context
						let count = 0
						while(index < length){
							let currentCourse = fetchedCourses[index]
							index++

							coursesDb.insert({
								id: currentCourse.id,
								mentor: currentCourse.mentor,
								completed: currentCourse.completed,
								start_date: currentCourse.start_date,
								title: currentCourse.title,
								validity: currentCourse.validity,
								resourceCount: currentCourse.resourceCount
							}, function(err, docs){
								resolvedCourses.push(docs)
								count++
								if(count === length){
									iterate = false
									resolve(resolvedCourses)
								}
							})
						}
					}
				})
			}
			else{
				resolve(courses)
			}
		})
	})

	const result = yield fetchUser()
	yield put(Actions.loadedCourses(result))
}