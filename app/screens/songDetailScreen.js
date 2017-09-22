import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import Dimensions from 'Dimensions';
import {API_REQUEST_SONG_GET} from "../actions/api";
import {PLAYER_NOWLIST_ADD, PLAYER_NOWLIST_CLEAR, PLAYER_PLAY} from "../actions/player";

class SongDetailScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        let {state: {params: {title} = {title: (new Date()).toISOString()}}} = navigation
        return {
            title,
            // header: null
        }
    }

    componentDidMount() {
        let {props} = this;
        let {state: {params: {id: songId}}} = props.navigation;
        props.loadSong(songId);
    }

    render() {
        let {props} = this;
        let {state: {params: {id: songId}}} = props.navigation;
        let {entities} = props
        let {songs: {[songId]: songResponse = {}} = {[songId]: {}}} = entities;
        return (<View>
            <Text>{songResponse.songTitle}</Text>
        </View>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            navigate: ownProps.navigation.navigate,
            entities: state.entities
        }
    },
    (dispatch, ownProps) => {
        return {
            loadSong: (songId) => {
                dispatch(API_REQUEST_SONG_GET(songId));
                dispatch(PLAYER_NOWLIST_CLEAR());
                dispatch(PLAYER_NOWLIST_ADD(songId));
                dispatch(PLAYER_PLAY());
            }
        }
    })(SongDetailScreen);