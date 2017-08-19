const fs = require('fs');
const diskinfo = require('diskinfo');
let pendriveData = {}
let pendriveCourses = []
let pendriveCourseIds = []
let pendriveLessons = []
let pendriveLessonIds = []
let pendriveResources = []
let pendriveResourceIds = []
let totalPendriveLessonsLength = 0
let totalPendriveResourcesLength = 0
let newPendriveDirectories = []
let mountPath = ""
let resourcesPaths = []

//initPendriveSync()

// Function to get List of USB devices connected
function initPendriveSync(){
	getDrive()
}

// Function to detect and select usb drive
function getDrive(){
	diskinfo.getDrives(function(err, drives) {
		for (let i = 0; i < drives.length; i++) {
			if(drives[i].filesystem.indexOf("Removable") > -1){
				let drive = drives[i].mounted;
				fs.readdirSync(drive).forEach(file => {
					if(file === "data.json"){
						mountPath = drive
						getJSONFile(drive)
					}
				})
			}
		}
	});
}

// Function to save pendrive configuration file to local db
function getJSONFile(mountLocation){
	let filePath = mountLocation + '/data.json'
	let localFilePath = 'assets/databases/newdata.json'
	fs.createReadStream(filePath).pipe(fs.createWriteStream(localFilePath)).on('close', function(){
		pendriveData = JSON.parse(fs.readFileSync(localFilePath))
		pendriveCourses = pendriveData.courses
		savePendriveCourses()
	})
}

// Function to save pendrive courses in database
function savePendriveCourses(){
	let index = 0
	let length = pendriveCourses.length

	for(let i=0; i<length; i++){
		let currentPendriveCourse = pendriveCourses[i]
		pendriveCourseIds.push(currentPendriveCourse.id)
		pendriveLessons.push(currentPendriveCourse.lessons)
		totalPendriveLessonsLength = totalPendriveLessonsLength + currentPendriveCourse.lessons.length

		coursesDb.insert({
			id: currentPendriveCourse.id,
			mentor: currentPendriveCourse.mentor,
			completed: currentPendriveCourse.completed,
			start_date: currentPendriveCourse.start_date,
			title: currentPendriveCourse.title,
			validity: currentPendriveCourse.validity,
			resourceCount: currentPendriveCourse.resourceCount
		}, function(err, docs){
			index++
			if(index === length){
				savePendriveLessons()
			}
		})
	}
}

// Function to save pendrive lessons in database
function savePendriveLessons(){
	let index = 0

	for(let i=0; i<pendriveCourses.length; i++){
		let currentPendriveCourseLessons = pendriveLessons[i]
		let currentPendriveCourseId = pendriveCourseIds[i]
		let currentPendriveCourseLessonIds = []
		let innerLength = currentPendriveCourseLessons.length
		let innerIndex = 0
		let currentPendriveLessonResources = []

		for(let j=0; j<currentPendriveCourseLessons.length; j++){
			let currentPendriveLesson = currentPendriveCourseLessons[j]
			totalPendriveResourcesLength = totalPendriveResourcesLength + currentPendriveLesson.resources.length
			let currentPendriveDirectory = currentPendriveCourseId + '/' + currentPendriveLesson.id
			newPendriveDirectories.push(currentPendriveDirectory)
			currentPendriveCourseLessonIds.push(currentPendriveLesson.id)
			currentPendriveLessonResources.push(currentPendriveLesson.resources)

			unitsDb.insert({
				completed: currentPendriveLesson.perc,
				title: currentPendriveLesson.lessonplan_name,
				id: currentPendriveLesson.id,
				courseId: currentPendriveCourseId,
				videosNotDownloaded: 0
			}, function(err, docs){
				innerIndex++
				index++
				if(innerIndex === innerLength){
					pendriveLessonIds.push(currentPendriveCourseLessonIds)
					pendriveResources.push(currentPendriveLessonResources)
				}
				if(index === totalPendriveLessonsLength){
					savePendriveResources()
					createDirectories(newPendriveDirectories)
				}
			})
		}
	}
}

// Function to save pendrive resources to database
function savePendriveResources(){
	let index = 0

	for(let i=0; i<pendriveCourses.length; i++){
		let currentPendriveCourses = pendriveLessons[i]
		let length = currentPendriveCourses.length

		for(let j=0; j<length; j++){
			let currentPendriveLessonResources = pendriveResources[i][j]
			
			for(let k=0; k<currentPendriveLessonResources.length; k++){
				let currentPendriveResource = currentPendriveLessonResources[k]

				videosDb.insert({
					id: currentPendriveResource.resource_id,
					title: currentPendriveResource.resource_name,
					courseId: pendriveCourseIds[i],
					unitId: pendriveLessonIds[i][j],
					url: currentPendriveResource.fileName,
					localPath: "",
					isDownloaded: true,
					duration: currentPendriveResource.duration,
					resourceType: currentPendriveResource.resource_type
				}, function(err, docs){
					let currentResourcePath = {
						'id': docs.id,
						'unitId': docs.unitId,
						'courseId': docs.courseId,
						'fileName': docs.url
					}
					resourcesPaths.push(currentResourcePath)
					index++
					if(index === totalPendriveResourcesLength){
						startVideoTransfer()
					}
				})
			}
		}
	}
}

// Function to start transferring videos from pendrive to app installation path
function startVideoTransfer(){
	for(let i=0; i<resourcesPaths.length; i++){
		extractPendriveFile(resourcesPaths[i])
	}
}

function extractPendriveFile(currentResourcePath){
	let fileName = currentResourcePath.fileName
	let thisVideoId = currentResourcePath.id
	let thisUnitId = currentResourcePath.unitId
	let thisCourseId = currentResourcePath.courseId
	const path = require('path')
	let extractedFileTmpName = fileName.split('.')[0]
	let extractedFileName = ""
	let length = extractedFileTmpName.split('-').length
	for(let i=0; i<length; i++){
		if(i > 1){
			if(i === 2){
				extractedFileName = extractedFileName + extractedFileTmpName.split('-')[i]
			}
			else{
				extractedFileName = extractedFileName + "-" + extractedFileTmpName.split('-')[i]	
			}
		}
	}
	let videoUrl = extractedFileTmpName.split('-')[0] + "/" + extractedFileTmpName.split('-')[1]
	videoUrl = videoUrl + "/" + extractedFileName
	let videoPath = "../../assets/" + videoUrl + '/'
	let extractionPath = path.join(__dirname, videoPath)
	let zipFilePath = mountPath + '/' + fileName
	extract(zipFilePath, {dir: extractionPath}, function (err) {
	    if(err){
	      console.log(err)
	    }
	    console.log(extractionPath)
	    saveVideoPath(videoUrl, thisVideoId, thisUnitId, thisCourseId)
	})
}

function saveVideoPath(videoUrl, thisVideoId, thisUnitId, thisCourseId){
	videosDb.update({
		id: thisVideoId,
		unitId: thisUnitId,
		courseId: thisCourseId
	}, {
		$set: {
			localPath: videoUrl
		}
	}, function(err, doc){
		console.log('done')
	})
}