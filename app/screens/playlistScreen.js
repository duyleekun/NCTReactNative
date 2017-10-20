import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import AlbumCell from '../components/albumCell'
import {API_REQUEST_PLAYLIST_QUERY} from "../actions/api";
import {keyFromAction} from "../lib/action_utilities";



class PlaylistDetailScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        let {state: {params: {title} = {title: (new Date()).toISOString()}}} = navigation
        return {
            title,
            // header: null
        }
    }

    componentDidMount() {
        let {props} = this;
        // let {state: {params: {id: playlistId}}} = props.navigation;
        props.loadPlaylist();
    }

    _renderItem = ({item, index}) => (
        <AlbumCell
            id = {item}
            index = {index}
            onClick={this.props.gotoPlayList}
        />
    );


    render() {
        // let {state: {params: {id: playlistId}}} = props.navigation;
        let {entities, marginTop} = this.props
        // let {playlists: {[playlistId]: playlistResponse = {listSong: []}} = {[playlistId]: {}}} = entities
        // console.log('json playlist: ' + JSON.stringify(playlists))
        let playlists = entities[keyFromAction(API_REQUEST_PLAYLIST_QUERY())];
        return (<View style = {{padding: 15, paddingTop: marginTop + 15, backgroundColor: 'white'}}>
            <FlatList
                data={playlists}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                // getItemLayout={(data, index) => (
                //     {length: 40, offset: 40 * index, index}
                // )}
                numColumns = {3}
                renderItem = {this._renderItem}
                horizontal = {false}
            />
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
            loadPlaylist: () => {
                console.log('request playlist')
                dispatch(API_REQUEST_PLAYLIST_QUERY())
            },
            gotoPlayList: (playlistKey) => {
                ownProps.navigation.navigate('PlaylistDetail',{playlistKey})
            }
        }
    })(PlaylistDetailScreen);