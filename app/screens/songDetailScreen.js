import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import actions from "../actions"
import Dimensions from 'Dimensions';

class SongDetailScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        let {state: {params: {title} = {title: (new Date()).toISOString()}}} = navigation
        return {
            title,
            header: null
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
        console.log(songResponse)
        return (<View>
            {songResponse.songTitle}
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
                dispatch(actions.api.request.song.get(songId))
            }
        }
    })(SongDetailScreen);