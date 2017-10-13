import {Image, Text, TouchableHighlight, View} from "react-native";
import * as React from "react";
import {Component} from 'react';
import Styles from '../assets/styles/playListTouchableBtnStyles'

const thumbnails = {
    fav: require("../assets/images/ic_fav_normal.png"),
    download: require("../assets/images/ic_btn_download_normal.png"),
    share: require("../assets/images/ic_btn_share_normal.png"),
};
export default class PlayListTouchableBtn extends Component {

    getImage(img: String){
        return thumbnails[img];
    }

    constructor(props) {
        super(props);
        this.state = {
            pressed: false
        }
    }

    render() {
        let {props} = this;
        return (
            <TouchableHighlight onPress={()=>{}}
                                underlayColor={'white'}
                                style={Styles.btn}
                                onHideUnderlay={()=>{this.setState({pressed: false})}}
                                onShowUnderlay={()=>{this.setState({pressed: true})}}>
                <View style={Styles.btnContent}>
                    <Image
                        style={[{tintColor: this.state.pressed ? '#32AAEA' : null}, Styles.btnImg]}
                        source={this.getImage(props.img)}
                    />
                    <Text
                        style={{color: this.state.pressed ? '#32AAEA' : null}}
                    >{props.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
