import { combineReducers } from 'redux';
import alert from './alert'
import auth from './auth'
import profile from './profile'

 const rootReducers = combineReducers({
    alert,
    auth,
    profile
})
export default rootReducers