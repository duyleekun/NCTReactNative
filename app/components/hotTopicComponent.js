import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, TouchableOpacity} from "react-native";

export default class HotTopicComponent extends Component{
    _renderItem = ({item}) => (
        <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center',flex: 1}}>
            <Image
                style={{width: 30, height: 30, tintColor: "#32AAEA"}}
                source={{uri: item.iconUrl}}
            />
            <Text style={{textAlign: "center"}}>
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
                data={this.props.dataList}
                numColumns={4}
                keyExtractor={item=>item.topicId}
                renderItem={this._renderItem}
                style={{display: "flex", alignItem: "flex-start"}}
            />
        )
    }
}