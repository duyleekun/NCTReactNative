import {Component} from 'react'
import React from 'react';
import Dimensions from 'Dimensions';
import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/playlistDetailSongList'
import {displayListenTime} from "../config/utils"

export default class PlayListDetailSongListComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity
            style={Styles.row}
            onPress={()=>this.props.onclick(item.songKey)}
        >
            <View style={[Styles.detailHolder,{borderTopWidth: index === 0 ? 0 : 1}]}>
                <View style={Styles.detail}>
                    <Text style={Styles.title}>
                        {item.songTitle}
                    </Text>
                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                        {item.quality ===2 ?
                            <Image
                                style={{width: 16,
                                    aspectRatio: 33/22,
                                    marginRight: 3}}
                                source={require('../assets/images/ic_sq.png')}/>
                            :
                            null
                        }

                        {item.quality > 0 && item.videoKey !== "" ?
                            <Image
                                style={{width: 16,
                                    aspectRatio: 33/22,
                                    marginRight: 3}}
                                source={require('../assets/images/ic_mv.png')}/>
                            :
                            null
                        }
                        <Text style={Styles.artist}>
                            {item.artistName}
                        </Text>
                        <Image
                            style={{alignSelf: 'flex-end', width: 14, aspectRatio: 1, marginBottom:3, marginLeft: 10}}
                            source={require('../assets/images/ic_lebo_listen.png')}/>
                        <Text style={{color: '#8E8E8E', alignSelf: 'flex-end', fontSize: 13, paddingLeft: 5}}>
                            {displayListenTime(item.listened)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Image
                        style={{width: Dimensions.get('window').width / 16,height: Dimensions.get('window').width / 10, aspectRatio: 1}}
                        source={require('../assets/images/ic_btn_recsong_more.png')}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
    render(){
        return (
            <FlatList
                data={this.props.data}
                keyExtractor={item=>item.songKey}
                renderItem={this._renderItem}
            />
        )
    }
}