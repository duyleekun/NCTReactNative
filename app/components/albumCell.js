/**
 * Created by nguyenphuc on 9/28/17.
 */
import {connect} from "react-redux";
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import Dimensions from 'Dimensions';
import styles from '../config/styles'

class AlbumCell extends React.PureComponent{

    render(){
        let props = this.props
        let {entities} = props
        // let {playlists: {[entities.id]: playlist}} = entities
        let {playlists} = entities
        let playlist = playlists[props.id]
        return (<View style={{width: Dimensions.get('window').width/3, position: 'relative'}}>
            <View style={styles.albumImageContainer}>
                <View>
                    <Image source={{uri: playlist.playlistImage}} style={{width: '100%', height: '100%'}}/>
                </View>
                <View>
                    <Image source={require('../tempResPlaylist/bt_playpage_button_play_normal.png')} style={{width: '100%', aspectRatio: 1, position: 'absolute', marginBottom: 2, marginRight: 2}}/>
                </View>
            </View>
            <View>
                <Text style={styles.albumTitle} numberOfLines={2} ellipsizeMode={'tail'}>{playlist.playlistTitle}</Text>
            </View>
            <View>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode={'tail'}>{playlist.artistName}</Text>
            </View>
        </View>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            entities: state.entities
        }
    },
    (dispatch, ownProps) => {
        return {
            // gotoSong: (item) => {
            //     let {navigate} = ownProps.navigation
            //     navigate('SongDetail',{id: item.songKey, title: item.songTitle})
            // }
        }
    })(AlbumCell);