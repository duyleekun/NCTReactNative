import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, View, TouchableOpacity} from "react-native";
import Dimensions from 'Dimensions';
import Styles from '../assets/styles/homeVideoStyles'

const separatorWidth = 8; // should be even number
export default class HomeAlbumComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity
            style={{width: (Dimensions.get('window').width -30)/2, position: 'relative',
            marginTop: 5,
            marginLeft: index % 2 ===0 ? 0 : separatorWidth,}}
            onPress={()=>this.props.onClick(item.videoKey)}
        >
            <View style={Styles.albumImageContainer}>
                <View>
                    <Image
                        source={{uri: item.videoImage}}
                        style={{width: '100%', aspectRatio: 16/9}}/>
                </View>
            </View>
            <View>
                <Text style={Styles.albumTitle}
                      numberOfLines={2}
                      ellipsizeMode={'tail'}>
                    {item.videoTitle}
                </Text>
            </View>
            <View>
                <Text style={Styles.artist}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                    {item.artistName}
                </Text>
            </View>
        </TouchableOpacity>
    );
    render(){
        return(
            <FlatList
                data={this.props.data}
                numColumns={2}
                keyExtractor={item=>item.videoKey}
                renderItem={this._renderItem}
            />
        )
    }
}