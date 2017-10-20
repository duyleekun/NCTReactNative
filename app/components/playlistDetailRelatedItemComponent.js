import {PureComponent} from 'react'
import React from 'react';

import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/playlistDetailRelatedListStyles'
import {displayListenTime} from '../config/utils'

export default class PlaylistDetailRelatedListComponent extends PureComponent{
    render(){
        let {data,key} = this.props;
        return (
            <TouchableOpacity
                key={key}
                style={Styles.row}
                onPress={()=>this.props.onclick(data.playlistKey)}>
                <Image
                    style={Styles.cover}
                    source={{uri: data.playlistImage}}/>
                <View style={[Styles.detailHolder,{borderTopWidth: 1}]}>
                    <View style={Styles.detail}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={Styles.title}
                        >
                            {data.playlistTitle}
                        </Text>

                        <Text style={Styles.artist}>
                            {data.artistName}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Image
                                style={Styles.listenTime}
                                source={require('../assets/images/ic_lebo_listen.png')}/>
                            <Text style={Styles.listenNumber}>
                                {displayListenTime(data.listened)}
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
        )
    }
}