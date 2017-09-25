import {createAction} from 'redux-actions'

export const PLAYER_PLAY = createAction("PLAYER/PLAY");
export const PLAYER_PAUSE = createAction("PLAYER/PAUSE");

export const PLAYER_NOWLIST_ADD = createAction("PLAYER/NOWLIST/ADD", (songKey) => ({songKey}));
export const PLAYER_NOWLIST_CLEAR = createAction("PLAYER/NOWLIST/CLEAR");
export const PLAYER_NOWLIST_NEXT = createAction("PLAYER/NOWLIST/NEXT");
export const PLAYER_NOWLIST_PREVIOUS = createAction("PLAYER/NOWLIST/PREVIOUS");
export const PLAYER_EXPAND = createAction("PLAYER/EXPAND");
export const PLAYER_COLLAPSE = createAction("PLAYER/COLLAPSE");
export const PLAYER_TOGGLE = createAction("PLAYER/TOGGLE");