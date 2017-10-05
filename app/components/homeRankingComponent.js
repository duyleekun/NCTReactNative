import {Component} from 'react'
import React from 'react';
import Dimensions from 'Dimensions';
import {View, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/homeRankingStyles'

export default class HomeRankingComponent extends Component{
    render(){
        let {data} = this.props;
        if (data.length === 0)
            return null;
        return (
            <View style={Styles.container}>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 1002,}}>
                    <View style={{width: Dimensions.get('window').width / 10 , aspectRatio: 1}}>
                    <Image
                        style={{width: '100%', height: '100%'}}
                        source={require('../assets/images/recommend_king_no1.png')}/>
                    </View>
                </View>

                <TouchableOpacity style={Styles.holder}
                                  onPress={()=>this.props.onClick(data[1].key)}>
                    <Image
                        style={Styles.thumb}
                        source={{uri: data[1].image}}
                    />
                    <View style={Styles.detail}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={Styles.title}>
                            {data[1].refTitle}
                        </Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={Styles.artists}>
                            {data[1].artistNames}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.holderFirst}
                                  onPress={()=>this.props.onClick(data[0].key)}>
                    <Image
                        style={Styles.thumb}
                        source={{uri: data[0].image}}
                    />
                    <View style={Styles.detail}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={Styles.title}>
                            {data[0].refTitle}
                        </Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={Styles.artists}>
                            {data[0].artistNames}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.holder}
                                  onPress={()=>this.props.onClick(data[1].key)}>
                    <Image
                        style={Styles.thumb}
                        source={{uri: data[2].image}}
                    />
                    <View style={Styles.detail}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={Styles.title}>
                            {data[2].refTitle}
                        </Text>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode={"tail"}
                            style={Styles.artists}>
                            {data[2].artistNames}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}