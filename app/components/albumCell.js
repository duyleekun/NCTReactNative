/**
 * Created by nguyenphuc on 9/28/17.
 */
import {connect} from "react-redux";
import {Image, Text, TouchableOpacity, View} from "react-native";
import * as React from "react";
import Dimensions from 'Dimensions';
import styles from '../config/styles'

const separatorWidth = 6; // should be even number

class AlbumCell extends React.PureComponent{

    render(){
        let props = this.props
        let {entities} = props
        // let {playlists: {[entities.id]: playlist}} = entities
        let {playlists} = entities
        let playlist = playlists[props.id]
        let {index} = props
        return (
            <TouchableOpacity onPress={()=>this.props.onClick(playlist.playlistKey)} style={{width: (Dimensions.get('window').width - 30 - separatorWidth*2)/3, position: 'relative',
                marginLeft: index % 3 ===0 ? 0 : index % 3 === 1 ? separatorWidth/2 : separatorWidth,
                marginRight:index % 3 ===0 ? separatorWidth : index % 3 === 1 ? separatorWidth/2 : 0}}>
                <View style={styles.albumImageContainer}>
                    <Image source={{uri: playlist.playlistImage}} style={{width: '100%', height: '100%'}}/>
                    <View style={{width: '100%', height: '12%',backgroundColor: '#00000050', position: 'absolute', bottom: 0, alignItems: 'center', display: 'flex', flexDirection: 'row'}}>
                        <Image source={require('../tempResPlaylist/ic_listen_count.png')} style={{height: 10, width: 10 , marginLeft: 2}}/>
                        <Text style={styles.listened}>{playlist.listened}</Text>
                    </View>
                    <Image source={require('../tempResPlaylist/bt_playpage_button_play_normal.png')} style={styles.playImage}/>
                </View>
                <View>
                    <Text style={styles.albumTitle} numberOfLines={2} ellipsizeMode={'tail'}>{playlist.playlistTitle}</Text>
                </View>
                <View>
                    <Text style={styles.artist} numberOfLines={1} ellipsizeMode={'tail'}>{playlist.artistName}</Text>
                </View>
            </TouchableOpacity>)
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
            gotoSong: () => {
                console.log('go to song player')
                // let {navigate} = ownProps.navigation
                // navigate('SongDetail',{id: item.songKey, title: item.songTitle})
            }
        }
    })(AlbumCell);