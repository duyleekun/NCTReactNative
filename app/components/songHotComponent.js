import {Component} from 'react'
import React from 'react';
import Dimensions from 'Dimensions';
import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/songHotStyles'

export default class TopSongComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity style={Styles.row}>
            <Image
                style={{width: Dimensions.get('window').width / 9, aspectRatio: 1}}
                source={{uri: item.image}}/>
            <View style={[Styles.detailHolder,{borderTopWidth: index === 0 ? 0 : 1}]}>
                <View style={Styles.detail}>
                    <Text style={Styles.title}>
                        {item.songTitle}
                    </Text>
                    <Text style={Styles.artist}>
                        {item.artistName}
                    </Text>
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