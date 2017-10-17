import {Component} from 'react'
import React from 'react';

import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/playlistDetailRelatedListStyles'
import {displayListenTime} from '../config/utils'

export default class PlaylistDetailRelatedListComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity
            style={Styles.row}
            onPress={()=>this.props.onclick(item.songKey)}
        >
            <Image
                style={Styles.cover}
                source={{uri: item.playlistImage}}/>
            <View style={[Styles.detailHolder,{borderTopWidth: index === 0 ? 0 : 1}]}>
                <View style={Styles.detail}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={Styles.title}
                    >
                        {item.playlistTitle}
                    </Text>

                    <Text style={Styles.artist}>
                        {item.artistName}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            style={Styles.listenTime}
                            source={require('../assets/images/ic_lebo_listen.png')}/>
                        <Text style={Styles.listenNumber}>
                            {displayListenTime(item.listened)}
                        </Text>
                    </View>

                </View>
                <TouchableOpacity>
                    <Image
                        style={Styles.relatedItem}
                        source={require('../assets/images/ic_list_detail_nor.png')}/>
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