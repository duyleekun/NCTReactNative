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

    _onPressItem = (id: string) => (
        this.setState((state)=>{
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return {selected};
        })
    );

    _renderItem = ({item}) => (
        <AlbumCell
            onPressItem={this._onPressItem}
        />
    );


    render() {
        let {props} = this;
        // let {state: {params: {id: playlistId}}} = props.navigation;
        let {entities} = props
        // let {playlists: {[playlistId]: playlistResponse = {listSong: []}} = {[playlistId]: {}}} = entities
        // console.log('json playlist: ' + JSON.stringify(playlists))
        return (<View>
            <FlatList
                data={['a','b']}
                // keyExtractor={(item) => item.songKey}
                showsHorizontalScrollIndicator={false}
                // getItemLayout={(data, index) => (
                //     {length: 40, offset: 40 * index, index}
                // )}
                renderItem = {this._renderItem}
                horizontal={true}
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
            loadPlaylist: (playlistId = '') => {
                dispatch(API_REQUEST_PLAYLIST_QUERY())
            },
            gotoSong: (item) => {
                let {navigate} = ownProps.navigation
                navigate('SongDetail',{id: item.songKey, title: item.songTitle})
            }
        }
    })(PlaylistDetailScreen);