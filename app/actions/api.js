import {createActions} from 'redux-actions'

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
export const actions = createActions({
    API: {
        REQUEST: {
            HOME: {
                QUERY: () => ({path: '/commons/home-new?size=8', schemaName: 'home'}),
            },
            PLAYLIST: {
                QUERY: (...query) => ({path: '/playlists', query: query, schemaName: 'playlist'}),
                GET: (id, ...query) => ({path: `/playlists/${id}`, query: query, schemaName: 'playlist'}),
            },
            SONG: {
                QUERY: (...query) => ({path: '/songs', query: query}),
                GET: (id, ...query) => ({path: `/songs/${id}`, query: query}),
            },
            VIDEO: {
                QUERY: (...query) => ({path: '/videos', query: query}),
                GET: (id, ...query) => ({path: `/videos/${id}`, query: query}),
            },
            TOPIC: {
                QUERY: (...query) => ({path: '/topics', query: query}),
                GET: (id, ...query) => ({path: `/topics/${id}`, query: query}),
            },
        },
        RESPONSE: {
            SUCCESS: null,
            ERROR: null,
        }
    }
});