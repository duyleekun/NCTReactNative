import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import Dimensions from 'Dimensions';
import {API_REQUEST_PLAYLIST_GET} from "../actions/api";

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
        let {state: {params: {id: playlistId}}} = props.navigation;
        props.loadPlaylist(playlistId);
    }

    render() {
        let {props} = this;
        let {state: {params: {id: playlistId}}} = props.navigation;
        let {entities} = props
        let {playlists: {[playlistId]: playlistResponse = {listSong: []}} = {[playlistId]: {}}} = entities
        return (<View>
            <Image style={{width: Dimensions.get('window').width, aspectRatio: 619 / 250}}
                   source={{uri: playlistResponse.playlistImage}}/>
            <FlatList
                data={playlistResponse.listSong.map((id) => entities.songs[id])}
                keyExtractor={(item) => item.songKey}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback onPress={() => this.props.gotoSong(item)}>
                        {/*<View style={{width: Dimensions.get('window').width, aspectRatio: 619 / 250}}>*/}
                        {/*<Image source={{uri: item.image}} style={{width: '100%', height: '100%'}}/>*/}
                        {/*</View>*/}
                        <View>
                            <Text>{item.songTitle}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
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
            loadPlaylist: (playlistId) => {
                dispatch(API_REQUEST_PLAYLIST_GET(playlistId))
            },
            gotoSong: (item) => {
                let {navigate} = ownProps.navigation
                navigate('SongDetail',{id: item.songKey, title: item.songTitle})
            }
        }
    })(PlaylistDetailScreen);