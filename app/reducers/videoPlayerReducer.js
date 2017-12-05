/**
 * Created by nguyenphuc on 11/20/17.
 */
import {handleActions} from 'redux-actions'
import {VIDEOPLAYER_TOGGLE, VIDEOPLAYER_PLAY, VIDEOPLAYER_ADD, VIDEOPLAYER_EXPAND, VIDEOPLAYER_COLLAPSE, VIDEOPLAYER_HIDDEN, VIDEOPLAYER_SHOW, VIDEOPLAYER_PAUSE, VIDEOPLAYER_FULLSCREEN} from '../actions/videoPlayer'

import Immutable from 'seamless-immutable'

let initialState = Immutable({collapsed: true, isPlaying: false, videoId: '', isShow: false, fullScreen: false});

export default handleActions({
    [VIDEOPLAYER_PLAY]: (state, action) => state.set('isPlaying', true),
    [VIDEOPLAYER_PAUSE]: (state, action) => state.set('isPlaying', false),
    [VIDEOPLAYER_ADD]: (state, action) => state.set('videoId', action.payload),
    [VIDEOPLAYER_EXPAND]: (state, action) => state.set('collapsed', false),
    [VIDEOPLAYER_COLLAPSE]: (state, action) => state.set('collapsed', true),
    [VIDEOPLAYER_TOGGLE]: (state, action) => state.update('collapsed', (now) => !now),
    [VIDEOPLAYER_SHOW]: (state, action) => state.set('isShow', true),
    [VIDEOPLAYER_HIDDEN]: (state, action) => state.set('isShow', false),
    [VIDEOPLAYER_FULLSCREEN]: (state, action) => state.set('fullScreen', action.payload),
}, initialState)