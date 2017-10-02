import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, TouchableOpacity} from "react-native";
import Styles from '../assets/styles/hotTopicStyle'

export default class HotTopicComponent extends Component{
    _renderItem = ({item}) => (
        <TouchableOpacity style={Styles.holder}>
            <Image
                style={Styles.icon}
                source={{uri: item.iconUrl}}
            />
            <Text style={Styles.text}>
                {item.title}
                {/*{item.iconBGUrl}*/}
            </Text>
        </TouchableOpacity>
    );
    render(){
        // console.log(this.props.dataList[0].iconUrl)
        // console.log(this.props.dataList[0].iconBGUrl)
        return (
            <FlatList
                data={this.props.data}
                numColumns={4}
                keyExtractor={item=>item.topicId}
                renderItem={this._renderItem}
            />
        )
    }
}