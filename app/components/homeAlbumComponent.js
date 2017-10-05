import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, View, TouchableOpacity} from "react-native";
import Dimensions from 'Dimensions';
import Styles from '../assets/styles/homeAlbumComponent'

const separatorWidth = 6; // should be even number
export default class HomeAlbumComponent extends Component{
    _renderItem = ({item,index}) => (
        <TouchableOpacity style={{width: Dimensions.get('window').width/3 - separatorWidth*2, position: 'relative',
            marginTop: 5,
            marginLeft: index % 3 ===0 ? 0 : index % 3 === 1 ? separatorWidth/2 : separatorWidth,
            marginRight:index % 3 ===0 ? separatorWidth : index % 3 === 1 ? separatorWidth/2 : 0
        }}>
            <View style={Styles.albumImageContainer}>
                <View>
                    <Image
                        source={{uri: item.playlistImage}}
                        style={{width: '100%', height: '100%'}}/>
                </View>
            </View>
            <View>
                <Text style={Styles.albumTitle}
                      numberOfLines={2}
                      ellipsizeMode={'tail'}>
                    {item.playlistTitle}
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
                numColumns={3}
                keyExtractor={item=>item.playlistKey}
                renderItem={this._renderItem}
            />
        )
    }
}