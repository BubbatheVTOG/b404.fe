import React, { Component } from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'
import Login from '../components/login/login'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents';
import Workflow from '../pages/Workflow';
import Signatures from '../pages/Signatures';
import MainSettings from '../pages/MainSettings';
import Company from '../pages/Company';
import People from '../pages/People';
import AppRoute from './AppRoute'

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* <Route path="/" exact component = {Login} />
          <Route path="/login" exact component = {Login} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/documents" component={Documents} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/workflow" component={Workflow} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/signatures" component={Signatures} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/main-settings" component={MainSettings} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/admin" component={Admin} authed={this.props.isLoggedIn}/> */}
          <AppRoute path={process.env.PUBLIC_URL + "/"} exact component = {Login} />
          <AppRoute path={process.env.PUBLIC_URL + "/login"} exact component = {Login} />
          <AppRoute exact path={process.env.PUBLIC_URL + "/dashboard"} component={Dashboard} isPrivate/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/documents"} component={Documents} isPrivate/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/workflow"} component={Workflow} isPrivate/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/signatures"} component={Signatures} isPrivate/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/main-settings"} component={MainSettings} isPrivate/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/company"} component={Company} isPrivate requireAdmin/>
          <AppRoute exact path={process.env.PUBLIC_URL + "/people"} component={People} isPrivate requireAdmin/>
          {/* <AppRoute exact path="/admin" component={Admin} isPrivate requireAdmin/> */}
          <Redirect to={process.env.PUBLIC_URL + "/dashboard"}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

// const mapStateToProps = state => ({})

export default Routes;
// export default Routes
