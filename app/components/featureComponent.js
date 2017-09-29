import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import Styles from "../assets/styles/featureComponentStyles"
const thumbnails = {
    artist: require("../assets/images/ic_nghesy.png"),
    video: require("../assets/images/ic_video.png"),
    song: require("../assets/images/ic_song.png"),
    top: require("../assets/images/ic_top100.png")
};

export default class FeatureComponent extends Component{
    getImage(img: String){
        return thumbnails[img];
    }
    tabs = [
        {
            route: "ArtistListDetail",
            textString:  "Nghệ Sĩ",
            picUrl: "artist"
        },
        {
            route: "VideoListDetail",
            textString: "Video",
            picUrl: "video"
        },
        {
            route: "SongListDetail",
            textString: "Bài Hát",
            picUrl: "song"
        },
        {
            route: "Top100Detail",
            textString: "Top 100",
            picUrl: "top"
        }
    ];

    _renderItem = ({item}) => (
        <TouchableOpacity  onPress={() => this.props.onClick(item.route)} style={Styles.holder}>
            <Image
                style={Styles.img}
                source={this.getImage(item.picUrl)}
            />
            <Text style={Styles.text}>
                {item.textString}
            </Text>
        </TouchableOpacity>
    );
    render(){
        return (
            <FlatList
                data={this.tabs}
                numColumns={4}
                keyExtractor={item=>item.route}
                renderItem={this._renderItem}
            />
        )
    }
}
// export default connect(
//     (state, ownProps) => {
//         return {
//             navigate: ownProps.navigation.navigate,
//             entities: state.entities
//         }
//     },
//     (dispatch, ownProps) => {
//         return {
//             gotoScreen: (item) => {
//                 let {navigate} = ownProps.navigation;
//                 navigate(item.route)
//             }
//         }
//     })(FeatureComponent);