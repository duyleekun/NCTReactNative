/**
 * Created by nguyenphuc on 11/20/17.
 */
import {handleActions} from 'redux-actions'
import {VIDEOPLAYER_TOGGLE, VIDEOPLAYER_PLAY, VIDEOPLAYER_ADD, VIDEOPLAYER_EXPAND, VIDEOPLAYER_COLLAPSE} from '../actions/videoPlayer'

import Immutable from 'seamless-immutable'

let initialState = Immutable({collapsed: true, isPlaying: false, videoId: ''});

export default handleActions({
    [VIDEOPLAYER_PLAY]: (state, action) => state.set('isPlaying', true),
    [VIDEOPLAYER_ADD]: (state, action) => state.set('videoId', action.payload),
    [VIDEOPLAYER_EXPAND]: (state, action) => state.set('collapsed', false),
    [VIDEOPLAYER_COLLAPSE]: (state, action) => state.set('collapsed', true),
    [VIDEOPLAYER_TOGGLE]: (state, action) => state.update('collapsed', (now) => !now),
}, initialState)