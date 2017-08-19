const Datastore = require('nedb');  
let userDb = new Datastore({ filename: 'assets/databases/user.db', autoload: true });
let coursesDb = new Datastore({ filename: 'assets/databases/courses.db', autoload: true });
let unitsDb = new Datastore({ filename: 'assets/databases/lessons.db', autoload: true });
let videosDb = new Datastore({ filename: 'assets/databases/videos.db', autoload: true });

userDb.find({}, function(err, docs){
	if(err){
		console.log('handler start')
		console.log(err)
		console.log('handler end')
	}
	else{

		console.log('handler start')
		console.log(docs)
		console.log('handler end')
	}
})

let dataSyncRequired = false

// Function to save user details in db. The first function called from LoginContainer on successfull authentication
function saveUser(email, password, id, name){
	userDb.find({}, function(err, docs){
		if(docs.length === 0){
			addUser(email, password, id, name)
		}
		else{
			dataSyncRequired = true // Signifies that data needs to be refreshed across the app
			updateUser(email, password)
		}
	})
}

// Function to add a new user
function addUser(email, password, id, name){
	userDb.insert({
		email : email,
		password : password,
		id: id,
		name: name
	}, function(err, docs){})
}

// Function to update an existing user
function updateUser(email, password){
	userDb.update({
		email: email
	}, {
		$set: {
			email: email,
			password: password
		}
	}, function(err, users){})
}

function activeSessionExists(){
	
}