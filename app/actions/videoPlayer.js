/**
 * Created by nguyenphuc on 11/20/17.
 */
import {createAction} from  'redux-actions'

export const VIDEOPLAYER_TOGGLE = createAction("VIDEOPLAYER/TOGGLE");
export const VIDEOPLAYER_PLAY = createAction("VIDEOPLAYER/PLAY");
export const VIDEOPLAYER_PAUSE = createAction("VIDEOPLAYER/PAUSE");
export const VIDEOPLAYER_ADD = createAction("VIDEOPLAYER/ADD");
export const VIDEOPLAYER_EXPAND = createAction("VIDEOPLAYER/EXPAND");
export const VIDEOPLAYER_COLLAPSE = createAction("VIDEOPLAYER/COLLAPSE");
export const VIDEOPLAYER_SHOW = createAction("VIDEOPLAYER/SHOW");
export const VIDEOPLAYER_HIDDEN = createAction("VIDEOPLAYER/HIDDEN");
export const VIDEOPLAYER_FULLSCREEN = createAction("VIDEOPLAYER/FULLSCREEN");
