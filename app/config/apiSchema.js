import { schema } from 'normalizr';

export const artist = new schema.Entity('artists',{},{ idAttribute: 'artistKey' });
export const song = new schema.Entity('songs',{},{ idAttribute: 'songKey' });
export const video = new schema.Entity('videos',{},{ idAttribute: 'videoKey' });
export const playlist = new schema.Entity('playlists',{listSong: [song]},{ idAttribute: 'playlistKey' });
export const topic = new schema.Entity('topics',{},{ idAttribute: 'topicId' });
export const rankingItem = new schema.Entity('rankingItems',{},{ idAttribute: 'key' });
export const rankingMusics = new schema.Entity('rankingMusics',{items: [rankingItem]},{ idAttribute: 'key' });
export const rankingVideos = new schema.Entity('rankingVideos',{items: [rankingItem]},{ idAttribute: 'key' });
export const lyric = new schema.Entity('lyric',{},{idAttribute: 'lyricId'})
export const lyricsData = new schema.Entity('lyricsData',{}, {idAttribute: 'id'})
export const home = new schema.Entity('home',{
    // ShowCase: [song],
    AlbumHot: [playlist],
    VideoHot: [video],
    SongHot: [song],
    TopicHot: [topic],
    Relax: [video],
    PlayListByTime: [playlist],
    BXH: [rankingMusics],
    BXHVideo: [rankingVideos]
},{ idAttribute: () => 0 });

export const playlists = new schema.Array(playlist);
export const videos = new schema.Array(video)
export const songPlay = new schema.Entity('song',{},{idAttribute: 'songKey'})
export const videoPlay = new schema.Entity('video',{},{idAttribute: 'videoKey'})