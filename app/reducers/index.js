import navReducer from './navReducer'
import apiReducer from './apiReducer'
import playerReducer from './playerReducer'
import {combineReducers} from "redux";

export default combineReducers({nav: navReducer, entities: apiReducer, player: playerReducer})