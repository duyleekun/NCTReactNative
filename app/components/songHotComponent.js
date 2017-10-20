import {Component} from 'react'
import React from 'react';
import Dimensions from 'Dimensions';
import {View,FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/songHotStyles'

export default class TopSongComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity
            style={Styles.row}
            onPress={()=>this.props.onclick(item.songKey)}
        >
            <Image
                style={{width: Dimensions.get('window').width / 9, aspectRatio: 1}}
                source={{uri: item.image}}/>
            <View style={[Styles.detailHolder,{borderTopWidth: index === 0 ? 0 : 1}]}>
                <View style={Styles.detail}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={Styles.title}>
                        {item.songTitle}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {item.quality ===2 ?
                            <Image
                                style={Styles.itemStatus}
                                source={require('../assets/images/ic_sq.png')}/>
                            :
                            null
                        }

                        {item.quality > 0 && item.videoKey !== "" ?
                            <Image
                                style={Styles.itemStatus}
                                source={require('../assets/images/ic_mv.png')}/>
                            :
                            null
                        }
                        <Text style={Styles.artist}>
                            {item.artistName}
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