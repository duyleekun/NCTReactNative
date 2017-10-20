import {createActions} from 'redux-actions'
import createAction from "redux-actions/es/createAction";

export const isRequest = (type) => {
    return /^API\/REQUEST\/.*/.test(type)
}

export const isResponse = (type) => {
    return /^API\/RESPONSE\/.*/.test(type)
}

export const isResponseOk = (type) => {
    return /^API\/RESPONSE\/SUCCESS/.test(type)
}

export const isResponseError = (type) => {
    return /^API\/RESPONSE\/ERROR/.test(type)
}


//Actions should end with QUERY(for get many), GET(for get one), UPDATE(for update), CREATE(for create)
export const API_REQUEST_HOME_QUERY = createAction('API/REQUEST/HOME/QUERY', () => ({
    path: '/commons/home-new?size=8',
    schemaName: 'home'
}))
export const API_REQUEST_PLAYLIST_QUERY = createAction('API/REQUEST/PLAYLIST/QUERY', (...query) => ({
    path: '/playlists/genre/0?pageindex=1&pagesize=30&etype=tini&type=hottest&cached=0',
    query: query,
    schemaName: 'playlistsScreen'
}))
export const API_REQUEST_PLAYLIST_GET = createAction('API/REQUEST/PLAYLIST/GET', (id, ...query) => ({
    path: `/playlists/${id}`,
    query: query,
    schemaName: 'playlist'
}))
export const API_REQUEST_PLAYLIST_RELATION = createAction('API/REQUEST/PLAYLIST/RELATION', (id, ...query) => ({
    path: `/playlists/related/${id}`,
    query: query,
    schemaName: 'playlistRelation'
}))
export const API_REQUEST_SONG_QUERY = createAction('API/REQUEST/SONG/QUERY', (...query) => ({
    path: '/songs',
    query: query,
    schemaName: 'song'
}))
export  const API_REQUEST_SONG_RELATION = createAction('API/REQUEST/SONG/RELATION', (id,...query)=>({
    path: `/songs/playlist-relation/${id}`,
    query: query,
    schemaName: 'songRelation'
}))
export const API_REQUEST_SONG_GET = createAction('API/REQUEST/SONG/GET', (id, ...query) => ({
    path: `/songs/${id}`,
    query: query,
    schemaName: 'song'
}))
export const API_REQUEST_SONG_LYRIC = createAction('API/REQUEST/SONG/LYRIC', (id, ...query) => ({
    path: `/songs/lyric/${id}`,
    query: query,
    schemaName: 'lyric'
}))
export const API_REQUEST_VIDEO_QUERY = createAction('API/REQUEST/VIDEO/QUERY', (...query) => ({
    path: '/videos',
    query: query
}))
export const API_REQUEST_VIDEO_GET = createAction('API/REQUEST/VIDEO/GET', (id, ...query) => ({
    path: `/videos/${id}`,
    query: query
}))
export const API_REQUEST_TOPIC_QUERY = createAction('API/REQUEST/TOPIC/QUERY', (...query) => ({
    path: '/topics',
    query: query
}))
export const API_REQUEST_TOPIC_GET = createAction('API/REQUEST/TOPIC/GET', (id, ...query) => ({
    path: `/topics/${id}`,
    query: query
}))
export const API_RESPONSE_SUCCESS = createAction('API/RESPONSE/SUCCESS')
export const API_RESPONSE_ERROR = createAction('API/RESPONSE/ERROR')