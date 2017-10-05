import {Component} from 'react'
import React from 'react';
import {View, Image, Text, TouchableOpacity} from "react-native";
import {SECTION_HEADER_ALBUM,SECTION_HEADER_TODAY,SECTION_HEADER_TOPIC,SECTION_HEADER_RANKING,SECTION_HEADER_SONG,SECTION_HEADER_VIDEO,SECTION_HEADER_FUNNY} from "../config/constants"
import Styles from "../assets/styles/sectionHeaderStyles"
const icons = {
    [SECTION_HEADER_ALBUM]: require("../assets/images/ic_recommend_scene.png"),
    [SECTION_HEADER_TODAY]: require("../assets/images/ic_recommend_by_time.png"),
    [SECTION_HEADER_TOPIC]: require("../assets/images/ic_recommend_columnist.png"),
    [SECTION_HEADER_RANKING]: require("../assets/images/ic_recommend_chart.png"),
    [SECTION_HEADER_SONG]: require("../assets/images/ic_recommend_song.png"),
    [SECTION_HEADER_VIDEO]: require("../assets/images/ic_recommend_mv.png"),
    [SECTION_HEADER_FUNNY]: require("../assets/images/ic_recommend_funny.png")
};
export default class SectionHeaderComponent extends Component{
    getIcon(string){
        return icons[string]
    }
    render(){
        let props = this.props;
        return(
            <View style={[Styles.holder,Styles.container]}>
                <Image
                    style={Styles.icon}
                    source={this.getIcon(props.icon)}
                />
                <Text style={Styles.title}>
                    {props.title}
                </Text>
                <TouchableOpacity style={Styles.holder}>
                    <Text>
                        Thêm
                    </Text>
                    <Image
                        style={Styles.imgMore}
                        source={require("../assets/images/ic_more_left_arrow_nor.png")}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}