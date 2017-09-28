import {Component} from 'react'
import React from 'react';
import {FlatList, Image, Text, View} from "react-native";
import {connect} from "react-redux";

const thumbnails = {
    artist: require("../assets/images/ic_nghesy.png"),
    video: require("../assets/images/ic_video.png"),
    song: require("../assets/images/ic_song.png"),
    top: require("../assets/images/ic_top100.png")
};

class FeatureComponent extends Component{
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
        <View onPress={this.props.gotoScreen(item)} style={{width: '25%', textAlign: 'center'}}>
            <Image
                style={{width: 70, height: 70}}
                source={this.getImage(item.picUrl)}
                // source={require("../assets/images/ic_top100.png")}
            />
            <Text>
                {item.textString}
            </Text>
        </View>
    );
    render(){
        return (
            <FlatList
                data={this.tabs}
                numColumns={4}
                renderItem={this._renderItem}
            />
        )
    }
}
export default connect(
    (state, ownProps) => {
        return {
            navigate: ownProps.navigation.navigate,
            entities: state.entities
        }
    },
    (dispatch, ownProps) => {
        return {
            gotoScreen: (item) => {
                let {navigate} = ownProps.navigation;
                // navigate(item.route)
            }
        }
    })(FeatureComponent);