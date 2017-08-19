import React from 'react'
import { Route, IndexRoute } from 'react-router-dom'
import LoginContainer from './containers/LoginContainer'
import CoursesContainer from './containers/CoursesContainer'
import HomeContainer from './containers/HomeContainer'

// Routes for the products list and products details pages

const routes = (
	<div>
		<Route exact path="/" component={ LoginContainer } />
		<Route exact path="/course/unit" component={ CoursesContainer } />
		<Route exact path="/home" component={ HomeContainer } />
	</div>
)

export default routes;
