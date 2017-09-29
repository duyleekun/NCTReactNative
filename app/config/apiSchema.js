import { schema } from 'normalizr';

export const artist = new schema.Entity('artists',{},{ idAttribute: 'artistKey' })
export const song = new schema.Entity('songs',{},{ idAttribute: 'songKey' })
export const video = new schema.Entity('videos',{},{ idAttribute: 'videoKey' })
export const playlist = new schema.Entity('playlists',{listSong: [song]},{ idAttribute: 'playlistKey' })
export const topic = new schema.Entity('topics',{},{ idAttribute: 'topicId' })
export const home = new schema.Entity('home',{
    // ShowCase: [song],
    AlbumHot: [playlist],
    VideoHot: [video],
    SongHot: [song],
    // TopicHot: [topic],
    Relax: [video],
    PlayListByTime: [playlist],
},{ idAttribute: () => 0 });
