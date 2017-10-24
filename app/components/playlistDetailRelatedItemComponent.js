import {PureComponent} from 'react'
import React from 'react';

import {View,FlatList, Image, Text, TouchableOpacity, TouchableHighlight} from "react-native";
import Styles from '../assets/styles/playlistDetailRelatedListStyles'
import {displayListenTime} from '../config/utils'

export default class PlaylistDetailRelatedListComponent extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            pressed: false
        }
    }

    render(){
        let {data,idx} = this.props;
        return (
            <TouchableHighlight
                onLayout={idx===2?this.props.onLayout: null}
                style={Styles.row}
                onPress={()=>this.props.onclick(data.playlistKey)}
                onHideUnderlay={()=>{this.setState({pressed: false})}}
                onShowUnderlay={()=>{this.setState({pressed: true})}}
                underlayColor={'white'}>
                <View style={{flexDirection: 'row',backgroundColor: this.state.pressed ? 'gainsboro' : 'white'}}>
                    <Image
                        style={[Styles.cover,{alignSelf: 'center',marginLeft: 15}]}
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

                            <Text style={Styles.artist}
                                  numberOfLines={1}
                                  ellipsizeMode={'tail'}>
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
                </View>
            </TouchableHighlight>
        )
    }
}