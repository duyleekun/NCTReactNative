import {Component} from 'react'
import React from 'react';
import {View, Image, Text, TouchableOpacity} from "react-native";
import {SECTION_HEADER_ALBUM,SECTION_HEADER_TODAY,SECTION_HEADER_TOPIC,SECTION_HEADER_RANKING,SECTION_HEADER_SONG,SECTION_HEADER_VIDEO} from "../config/constants"
const icons = {
    [SECTION_HEADER_ALBUM]: require("../assets/images/ic_recommend_scene.png"),
    [SECTION_HEADER_TODAY]: require("../assets/images/ic_recommend_by_time.png"),
    [SECTION_HEADER_TOPIC]: require("../assets/images/ic_recommend_columnist.png"),
    [SECTION_HEADER_RANKING]: require("../assets/images/ic_recommend_chart.png"),
    [SECTION_HEADER_SONG]: require("../assets/images/ic_recommend_song.png"),
    [SECTION_HEADER_VIDEO]: require("../assets/images/ic_recommend_mv.png")
};
export default class SectionHeaderComponent extends Component{
    getIcon(string){
        return icons[string]
    }
    render(){
        let props = this.props;
        return(
            <View style={{flexDirection: "row", paddingBottom:0, alignItems: "center"}}>
                <Image
                    style={{height: 12, width: 12, marginRight:3}}
                    source={this.getIcon(props.icon)}
                />
                <Text style={{fontWeight: 'bold', flex: 1, fontSize: 15}}>
                    {props.title}
                </Text>
                <TouchableOpacity style={{flexDirection: "row"}}>
                    <Text>
                        Thêm
                    </Text>
                    <Image
                        style={{height: 15, width: 15, paddingBottom:0, marginLeft: 1}}
                        source={require("../assets/images/ic_more_left_arrow_nor.png")}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}