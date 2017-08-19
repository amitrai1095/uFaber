let userEmail = ""
let userId = ""
const request = require('request')
let coursesAPI = "", lessonsAPI = "", resourcesAPI = ""
let newCourseIds = []
let newCourses = []
let newLessonIds = []
let newLessons = []
let newResources = []
let courseResourceCount = []
let totalLength = 0
let newDirectories = []

function setUserData(email, id){
	userEmail = email
	userId = id
	coursesAPI = "http://api.ufaber.com/api/package/"+ userEmail +"/"
}

// Function to initialize sync function
function initServerSync(){
	getOfflineCoursesCount()
}

// Function to get number of courses store offline
function getOfflineCoursesCount(){
	coursesDb.find({}, function(err, docs){
		syncCourses(docs.length)
	})
}

// Function to get courses from server
function syncCourses(offlineCourseCount){
	request(coursesAPI, function(err, response, body){
		if(err){
			console.log(err)
		}
		let result = JSON.parse(body)
		if(result.context.length > offlineCourseCount){
			getNewCourses(result.context)
		}
	})
}

// Function to get newly added courses
function getNewCourses(fetchedCourses){
	let iterate = true
	let index = 0
	let length = fetchedCourses.length
	let count = 0
	while(index < length){
		let currentCourse = fetchedCourses[index]
		let currentCourseId = currentCourse.id
		index++
		coursesDb.find({
			id: currentCourseId
		}, function(err, docs){
			if(docs.length === 0){
				newCourseIds.push(currentCourseId)
				newCourses.push(currentCourse)
			}
			count++
			if(count === length){
				iterate = false
				syncLessons()
			}
		})
	}
}

// Function to get lessons of the courses from the server
function syncLessons(){
	let iterate = true
	let coursesIndex = 0
	let length = newCourseIds.length
	let count = 0
	while(coursesIndex < length){
		let currentCourseId = newCourseIds[coursesIndex]
		lessonsAPI = "https://api.ufaber.com/api/package/"+ userId +"/pack/"+ currentCourseId +"/"
		coursesIndex++
		request(lessonsAPI, function(err, response, body){
			if(err){
				console.log(err)
			}
			let result = JSON.parse(body)
			let lessonIds = []
			for(let i=0; i<result.context.length; i++){
				lessonIds.push(result.context[i].id)
			}
			newLessonIds.push(lessonIds)
			newLessons.push(result.context)
			count++
			if(count === length){
				iterate = false
				syncResources()
			}
		})
	}
}

// Function to get resources of the lessons from the server
function syncResources(){
	let iterate = true
	let coursesLength = newCourseIds.length
	let count = 0
	for(let i=0; i<coursesLength; i++){
		totalLength = totalLength + newLessonIds[i].length
	}

	for(let i=0; i<coursesLength; i++){
		let currentCourseId = newCourseIds[i]
		let currentCourseLessons = newLessonIds[i]
		let lessonsLength = newLessonIds[i].length
		let currentCourseResources = []
		let innerLoopCount = 0

		for(let j=0; j<lessonsLength; j++){
			let currentLessonResources = []

			resourcesAPI = "https://api.ufaber.com/api/package/"+ userId +"/lessonplan/"+ currentCourseLessons[j] +"/pack/"+ currentCourseId +"/"

			request(resourcesAPI, function(err, response, body){
				if(err){
					console.log(err)
				}
				let result = JSON.parse(body)
				currentLessonResources = result.context
				currentCourseResources.push(currentLessonResources)
				innerLoopCount++
				if(innerLoopCount === lessonsLength){
					newResources.push(currentCourseResources)
				}
				count++
				if(count === totalLength){
					saveCourses(newCourses)
				}
			})
		}
	}
}

// Function to save the courses to the database
function saveCourses(courses){
	let index = 0
	let length = courses.length
	for(let i=0; i<courses.length; i++){
		coursesDb.insert({
			id: courses[i].id,
			mentor: courses[i].mentor,
			completed: courses[i].completed,
			start_date: courses[i].start_date,
			title: courses[i].title,
			validity: courses[i].validity,
			resourceCount: courses[i].resourceCount
		}, function(err, docs){
			index++
			if(index === length){
				saveLessons(newLessons)
			}
		})
	}
}

// Function to save the lessons to the database
function saveLessons(lessons){
	let count = 0
	for(let i=0; i<lessons.length; i++){
		let currentCourseLessons = lessons[i]
		let currentCourseId = newCourseIds[i]
		for(let j=0; j<currentCourseLessons.length; j++){
			let currentLessonId = currentCourseLessons[j].id
			let currentDirectory = './assets/' + currentCourseId + "/" + currentLessonId
			newDirectories.push(currentDirectory)
			unitsDb.insert({
				completed: currentCourseLessons[j].perc,
				title: currentCourseLessons[j].lessonplan_name,
				id: currentCourseLessons[j].id,
				courseId: newCourseIds[i],
				videosNotDownloaded: 2210
			}, function(err, docs){
				count++
				if(count === totalLength){
					saveResources(newResources)
					createDirectories(newDirectories)
				}
			})
		}
	}
}

// Function to save the resources to the database
function saveResources(resources){
	let index = 0

	for(let i=0; i<resources.length; i++){
		let currentCourseResources = resources[i]
		let lessonResourceCount = []
		let innerLoopCount = 0
		let length = currentCourseResources.length

		for(let j=0; j<currentCourseResources.length; j++){
			let currentLessonResources = currentCourseResources[j]
			lessonResourceCount.push(currentLessonResources.length)
			for(let k=0; k<currentLessonResources.length; k++){
				let currentResource = currentLessonResources[k]
				videosDb.insert({
					id: currentResource.resource_id,
					title: currentResource.resource_name,
					courseId: newCourseIds[i],
					unitId: newLessonIds[i][j],
					url: currentResource.encrypt_file,
					localPath: "",
					isDownloaded: false,
					duration: currentResource.duration,
					resourceType: currentResource.resource_type
				}, function(err, docs){})
			}
			innerLoopCount++
			index++
			if(innerLoopCount === length){
				courseResourceCount.push(lessonResourceCount)
			}
			if(index === totalLength){
				updateResourceCount()
			}	
		}
	}
}

// Function to initialize videosNotDownloaded field in lessons table
function updateResourceCount(){
	for(let i=0; i<courseResourceCount.length; i++){
		let lessonResourceCount = courseResourceCount[i]
		let currentCourseId = newCourseIds[i]
		for(let j=0; j<lessonResourceCount.length; j++){
			let currentLessonResourceCount = lessonResourceCount[j]
			let currentLessonId = newLessonIds[i][j]
			//console.log(currentLessonResourceCount)
			unitsDb.update({
				id: currentLessonId,
				courseId: currentCourseId
			}, {
				$set: {
					videosNotDownloaded:currentLessonResourceCount
				}
			}, function(err, doc){})
		}
	}
}

