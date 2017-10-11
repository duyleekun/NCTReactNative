import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import AlbumCell from '../components/albumCell'
import {API_REQUEST_PLAYLIST_QUERY} from "../actions/api";



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
        />
    );


    render() {
        // let {state: {params: {id: playlistId}}} = props.navigation;
        let {entities, marginTop} = this.props
        // let {playlists: {[playlistId]: playlistResponse = {listSong: []}} = {[playlistId]: {}}} = entities
        // console.log('json playlist: ' + JSON.stringify(playlists))
        let playlists = entities["\"playlistsScreen\""]
        return (<View style = {{margin: 15, marginTop: marginTop + 15, backgroundColor: 'white'}}>
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
            gotoSong: (item) => {
                let {navigate} = ownProps.navigation
                navigate('SongDetail',{id: item.songKey, title: item.songTitle})
            }
        }
    })(PlaylistDetailScreen);