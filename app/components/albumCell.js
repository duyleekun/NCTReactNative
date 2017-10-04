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
            <Image source={{uri: playlist.playlistImage}} style={{width: '100%', height: '100%'}}/>
            </View>
            <View>
                <Text style={styles.albumTitle}>{playlist.playlistTitle}</Text>
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