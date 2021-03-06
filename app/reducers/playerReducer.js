import {handleActions} from "redux-actions";
import {
    PLAYER_COLLAPSE,
    PLAYER_EXPAND,
    PLAYER_NOWLIST_ADD, PLAYER_NOWLIST_CLEAR, PLAYER_NOWLIST_NEXT, PLAYER_NOWLIST_PREVIOUS, PLAYER_PAUSE,
    PLAYER_PLAY, PLAYER_TOGGLE
} from "../actions/player";
import Immutable from 'seamless-immutable'


let initialState = Immutable({isPlaying: false, nowList: [], nowAt: -1, collapsed: true});

export default handleActions({
    [PLAYER_PLAY]: (state, action) => {
        return state.set('isPlaying', true).update('nowAt', (currentNowAt) => currentNowAt > -1 ? currentNowAt : (state.nowList.length - 1))
    },
    [PLAYER_PAUSE]: (state, action) => state.set('isPlaying', false),
    [PLAYER_NOWLIST_ADD]: (state, action) => state.update('nowList', (nowList) => nowList.concat([action.payload.songKey])),
    [PLAYER_NOWLIST_CLEAR]: (state, action) => state.set('isPlaying', false).set('nowList', []).set('nowAt', -1),
    [PLAYER_NOWLIST_NEXT]: (state, action) => state.update('nowAt', (currentAt) => Math.min(state.nowList.length - 1, currentAt + 1)),
    [PLAYER_NOWLIST_PREVIOUS]: (state, action) => state.update('nowAt', (currentAt) => Math.max(-1, currentAt - 1)),
    [PLAYER_EXPAND]: (state, action) => state.set('collapsed', false),
    [PLAYER_COLLAPSE]: (state, action) => state.set('collapsed', true),
    [PLAYER_TOGGLE]: (state, action) => state.update('collapsed', (now) => !now),
}, initialState)