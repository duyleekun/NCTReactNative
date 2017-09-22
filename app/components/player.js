import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY} from "../actions/player";
import React from "react";
import {Button, Image, Text, View} from "react-native";

const Player = (props) => (
    <View style={{
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow'
    }}>
        <Image style={{height: '100%', aspectRatio: 1, backgroundColor: 'red'}}/>
        {props.isPlaying ? (<Button title="Pause" onPress={props.pause}/>) : (
            <Button title="Play" onPress={props.play}/>)}
        <Button title="Next" onPress={props.next}/>
        <View style={{flex: 1}}>
            <Text>{props.song.songTitle}</Text>
            <Text>{props.song.artistName}</Text>
        </View>
    </View>
)

export default connect((state, ownProps) => {
    const {player: {isPlaying, nowList, nowAt}, entities} = state
    return {isPlaying, nowAt, song: nowList.map((songKey) => entities.songs[songKey])[nowAt] || {}}
}, (dispatch, ownProps) => ({
    play: () => dispatch(PLAYER_PLAY()),
    pause: () => dispatch(PLAYER_PAUSE()),
    next: () => dispatch(PLAYER_NOWLIST_NEXT()),
}))(Player)