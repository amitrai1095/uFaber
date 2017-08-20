import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { Actions } from '../actions'

class LoginContainer extends React.Component {

	constructor(props){
		super(props)
		this.state = {}
		let _ = this
		if(justLoggedOutFlag){
			_.state = { emailErrorStyleClass : 'noInvalidEmailError', shouldRender : true }
		}
		else{
			_.state = { emailErrorStyleClass : 'noInvalidEmailError', shouldRender : false }
			// Checking if an active session exists
			userDb.find({}, function(err, docs){ // userDb is defined in assets/js/database.js
				if(err || docs.length === 0){
					_.setState({ shouldRender: true })
				}
				else{
					setUserData(docs[0].email, docs[0].id)
					console.log('idhar')
					toggleFooterStyle()
					_.props.history.push('/home')
				}
			});
		}
	}

	componentDidUpdate(){
		// Checking if the user field in props is set or not & redirecting to course page if set
		let responseData = this.props.authReducer.data
		if(responseData.length === 1){
			toggleFooterStyle()
			console.log('udhar')
			this.props.history.push('/home');
		}
	}

	authenticate(e){
		e.preventDefault()
		let validEmail = true
		let userEmail = this.refs.email.value
		let userPassword = this.refs.password.value
		var atpos = userEmail.indexOf("@")
	    var dotpos = userEmail.lastIndexOf(".")
	    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=userEmail.length) {
	        validEmail = false
	    }
	    if(validEmail){
	    	this.setState(previousState => {
	    		return { emailErrorStyleClass : 'noInvalidEmailError' }
	    	})
			this.props.getUser({
				"email" : userEmail,
				"password" : userPassword
			})
	    }
	    else{
	    	this.setState(previousState => {
	    		return { emailErrorStyleClass : 'invalidEmailError' }
	    	})
	    }
	}

	render() {
		return(
			<div>
				{
					this.state.shouldRender &&
					<div className="login-container container-fluid">
						<div className="col-md-4 col-md-offset-4 login-wrapper">
							<img src="assets/images/logo.png"/>
							<input type="email" ref="email" className="login-email-input" placeholder="E-Mail" required />
							<p ref="emailError" className = { this.state.emailErrorStyleClass }>Not a valid E-Mail Id</p>
							<input type="password" ref="password" className="login-password-input" placeholder="Password" required/>
							<button className="login-submit-btn" onClick={ this.authenticate.bind(this) }>Login</button>
						</div>
						<div className="col-md-12 login-bottom">
							<p className="login-t-and-c-warning">By Logging In, you are agree to the <span className="login-terms-of-service-span">Terms of Service</span> and <span className="login-privacy-policy-span">Privacy Policy</span>.</p>
							<img src="assets/images/divider.png" className="divider" />
							<p className="login-forgot-password">Forgot Password?</p>
						</div>
					</div>
				}
			</div>
		)
	}
}

function mapStateToProps (state, props) {
  return state;
}

export default connect(mapStateToProps, Actions)(LoginContainer)