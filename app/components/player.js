import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY} from "../actions/player";
import React from "react";
import {Button, Image, Text, View} from "react-native";
import Sound from 'react-native-sound';

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;

const Player = (props) => (
    <View style={{
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow'
    }}>
        <Image style={{height: '100%', aspectRatio: 1, backgroundColor: 'red'}}/>
        {props.isPlaying ? (<Button title="Playing" onPress={props.pause}/>) : (
            <Button title="Paused" onPress={props.play}/>)}
        <Button title="Next" onPress={props.next}/>
        <View style={{flex: 1}}>
            <Text>{props.song.songTitle}</Text>
            <Text>{props.song.artistName}</Text>
        </View>
    </View>
)

export default connect((state, ownProps) => {
    const {player: {isPlaying, nowList, nowAt}, entities} = state
    const song = nowList.map((songKey) => entities.songs[songKey])[nowAt] || {
        songTitle: 'Tên',
        artistName: 'Artist',
        streamURL: []
    }

    if (song.streamURL.length > 0) {
        if (sound === null || (sound._filename !== song.streamURL[0].stream)) {
            if (sound) {
                sound.release()
            }
            sound = new Sound(song.streamURL[0].stream, '', error => {
                if (error) {
                    console.log(error)
                }
                sound.play()
            })
        }
    }

    if (sound) {
        if (isPlaying) {
            sound.play((msg) => {
                console.log(msg)
            })
        } else {
            sound.pause()
        }
    }
    return {isPlaying, nowAt, song}
}, (dispatch, ownProps) => ({
    play: () => dispatch(PLAYER_PLAY()),
    pause: () => dispatch(PLAYER_PAUSE()),
    next: () => dispatch(PLAYER_NOWLIST_NEXT()),
}))(Player)