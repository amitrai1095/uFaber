import { call, put } from 'redux-saga/effects';
import { Actions, ActionTypes } from '../actions';


const DEFAULTS = {
  q: ""
};

export default [
  [ActionTypes.GET_VIDEOS, getVideos],
];


export function* getVideos({payload}){
	let unitId = payload.unitId
	let userId = payload.userId
	let courseId = payload.courseId
	yield put(Actions.loadingVideos())

	const request = require('request')
	const fetchUser = () => new Promise((resolve, reject) => {
		videosDb.find({
			courseId: courseId,
			unitId : unitId
		}, function(err, videos){
			if(err || videos.length === 0){
				let resourcesAPI = "https://api.ufaber.com/api/package/"+ userId +"/lessonplan/"+ unitId +"/pack/"+ courseId +"/"
				let resolvedResources = []
				request(resourcesAPI, function(err, response, body){
					if(err){
						console.log(err)
					}
					else{
						let result = JSON.parse(body)
						if(result.context){
							let fetchedResources = result.context
							let iterate = true
							let index = 0
							let count = 0
							let length = fetchedResources.length

							unitsDb.update({
								id: unitId,
								courseId: courseId
							}, {
								$set: {
									videosNotDownloaded:fetchedResources.length
								}
							}, function(err, doc){})

							while(index < length){
								let currentResource = fetchedResources[index]
								index++

								videosDb.insert({
									id: currentResource.resource_id,
									title: currentResource.resource_name,
									courseId: courseId,
									unitId: unitId,
									url: currentResource.encrypt_file,
									localPath: "",
									isDownloaded: false,
									duration: currentResource.duration,
									resourceType: currentResource.resource_type
								}, function(err, doc){
									resolvedResources.push(doc)
									count++
									if(count === fetchedResources.length){
										resolve(resolvedResources)
									}
								})
							}
						}
					}
				})
			}
			else{
				resolve(videos)
			}
		})
	})

	const result = yield fetchUser()
	yield put(Actions.loadedVideos(result))
}