import { call, put } from 'redux-saga/effects';
import { Actions, ActionTypes } from '../actions';


const DEFAULTS = {
  q: ""
};

export default [
  [ActionTypes.GET_USER, getUser],
];


export function* getUser({payload}){
	let email = payload.email
	let password = payload.password

	yield put(Actions.loadingUser())

	const request = require('request')
	const fetchUser = () => new Promise((resolve, reject) => {
		request.post({
			url:'https://api.ufaber.com/api/desktop-app/login/',
			form: {
				email : email,
				password : password
			}}, function(err,httpResponse,body){
				if(err){
					console.log(err)
					let response = {
						'success': false,
						'failed': true
					}
					resolve(response)
				}
				else{
					let resp = JSON.parse(body)
					let response = {
						'success': false,
						'failed': false
					}
					if(resp.success){
						response = {
							'success': true
						}
					}
					userDb.insert({
						email : email,
						password : password,
						id: resp.user.id,
						name: resp.user.name
					}, function(err, docs){
						resolve(response)
					})
				}
		});
	})

	const result = yield fetchUser()
	yield put(Actions.loadedUser(result))
}