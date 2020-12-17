import React, { Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import Landing from "./components/layout/landing";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Alert from './components/layout/Alert'
import Dashboard from "./components/dashboard/dashboard";
import PrivateRoute from "./components/routing/privateRoute";
import CreateProfile from "./components/profileForms/createProfile";
import EditProfile from "./components/profileForms/editProfile";
import AddExperience from "./components/profileForms/addExperience";
import AddEducation from "./components/profileForms/addEducation";
import Profiles from "./components/profiles/Profiles";
import profile from "./components/profile/profile";


//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utills/setAuthToken";


if(localStorage.token){
  setAuthToken(localStorage.token)
}
const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert/>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={profile} />
              <PrivateRoute exact path= '/dashboard' component={Dashboard}/>
              <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
              <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
              <PrivateRoute exact path='/add-experience' component={AddExperience}/>
              <PrivateRoute exact path='/add-education' component={AddEducation}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
