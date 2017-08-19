import { call, put } from 'redux-saga/effects';
import { Actions, ActionTypes } from '../actions';


const DEFAULTS = {
  q: ""
};

export default [
  [ActionTypes.GET_UNITS, getUnits],
];


export function* getUnits({payload}){
	let courseId = payload.courseId
	let userId = payload.userId

	let directoriesToCreate = []

	yield put(Actions.loadingUnits())

	const request = require('request')
	const fetchUser = () => new Promise((resolve, reject) => {
		unitsDb.find({
			courseId : courseId
		}, function(err, docs){
			if(err || docs.length === 0){
				let lessonsAPI = "https://api.ufaber.com/api/package/"+ userId +"/pack/"+ courseId +"/"
				let resolvedLessons = []

				request(lessonsAPI, function(er, response, body){
					if(err){
						console.log(er)
					}
					else{
						let result = JSON.parse(body)
						if(result.context){
							let fetchedLessons = result.context
							let length = fetchedLessons.length
							let index = 0
							let count = 0

							while(index < length){
								let currentLesson = fetchedLessons[index]
								index++

								unitsDb.insert({
									completed: currentLesson.perc,
									title: currentLesson.lessonplan_name,
									id: currentLesson.id,
									courseId: courseId,
									videosNotDownloaded: 100
								}, function(err, doc){
									let currentDirectory = './assets/' + courseId + "/" + doc.id
									directoriesToCreate.push(currentDirectory)
									resolvedLessons.push(doc)
									count++
									if(count === length){
										createDirectories(directoriesToCreate)
										resolve(resolvedLessons)
									}
								})
							}
						}
					}
				})
			}
			else{
				resolve(docs)
			}
		});
	})

	const result = yield fetchUser()
	yield put(Actions.loadedUnits(result))
}