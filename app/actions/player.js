import {createAction} from 'redux-actions'

export const PLAYER_PLAY = createAction("PLAYER/PLAY");
export const PLAYER_PAUSE = createAction("PLAYER/PAUSE");

export const PLAYER_NOWLIST_ADD = createAction("PLAYER/NOWLIST/ADD", (media) => media.songKey || media.videoKey);
export const PLAYER_NOWLIST_CLEAR = createAction("PLAYER/NOWLIST/CLEAR");
export const PLAYER_NOWLIST_NEXT = createAction("PLAYER/NOWLIST/NEXT");
export const PLAYER_NOWLIST_PREVIOUS = createAction("PLAYER/NOWLIST/PREVIOUS");
