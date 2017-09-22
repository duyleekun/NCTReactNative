import navReducer from './navReducer'
import apiReducer from './apiReducer'
import {combineReducers} from "redux";

export default combineReducers({nav: navReducer, entities: apiReducer})