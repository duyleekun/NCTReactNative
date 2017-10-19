import {Component} from 'react'
import React from 'react';
import Dimensions from 'Dimensions';
import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/playlistDetailSongList'
import {displayListenTime} from "../config/utils"

export default class PlayListDetailSongItemComponent extends Component{
    render(){
        let {data,key} = this.props;
        return (
            <TouchableOpacity
                key={key}
                style={Styles.row}
                onPress={()=>this.props.onclick(data.songKey)}
            >
                <View style={Styles.detailHolder}>
                    <View style={Styles.detail}>
                        <Text style={Styles.title}>
                            {data.songTitle}
                        </Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            {data.quality ===2 ?
                                <Image
                                    style={{width: 16,
                                        aspectRatio: 33/22,
                                        marginRight: 3}}
                                    source={require('../assets/images/ic_sq.png')}/>
                                :
                                null
                            }

                            {data.quality > 0 && data.videoKey !== "" ?
                                <Image
                                    style={{width: 16,
                                        aspectRatio: 33/22,
                                        marginRight: 3}}
                                    source={require('../assets/images/ic_mv.png')}/>
                                :
                                null
                            }
                            <Text style={Styles.artist}>
                                {data.artistName}
                            </Text>
                            <Image
                                style={{alignSelf: 'flex-end', width: 14, aspectRatio: 1, marginBottom:3, marginLeft: 10}}
                                source={require('../assets/images/ic_lebo_listen.png')}/>
                            <Text style={{color: '#8E8E8E', alignSelf: 'flex-end', fontSize: 13, paddingLeft: 5}}>
                                {displayListenTime(data.listened)}
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
        )
    }
}