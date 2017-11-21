import navReducer from './navReducer'
import apiReducer from './apiReducer'
import playerReducer from './playerReducer'
import {combineReducers} from "redux";
import videoplayerReducer from  './videoPlayerReducer'

export default combineReducers({nav: navReducer, entities: apiReducer, player: playerReducer, videoplayer: videoplayerReducer})