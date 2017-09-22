import {connect} from "react-redux";
import {Button, Text, View} from "react-native";
import * as React from "react";
import actions from "../actions"

class PlaylistDetailScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        let {state: {params: {title} = {title: (new Date()).toISOString()}}} = navigation
        return {
            title
        }
    }

    componentDidMount() {
        let {props} = this;
        let {state: {params: {id: playlistId}}} = props.navigation;
        props.loadPlaylist(playlistId);
    }

    render() {
        let {props} = this;
        let {state: {params: {id: playlistId}}} = props.navigation;
        let {entities: {playlist: {[playlistId]: playlistResponse} = {[playlistId]: {}}}} = props
        return (<View>
            <Text>Playlist</Text>
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
            loadPlaylist: (playlistId) => {
                dispatch(actions.api.request.playlist.get(playlistId))
            }
        }
    })(PlaylistDetailScreen);