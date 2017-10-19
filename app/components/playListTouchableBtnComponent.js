import {Image, Text, TouchableHighlight, View} from "react-native";
import * as React from "react";
import {Component} from 'react';
import Styles from '../assets/styles/playListTouchableBtnStyles'

const thumbnails = {
    fav: require("../assets/images/ic_fav_normal.png"),
    download: require("../assets/images/ic_btn_download_normal.png"),
    share: require("../assets/images/ic_btn_share_normal.png"),
    like: require('../assets/images/ic_button_like_normal.png'),
    play: require('../assets/images/bt_playpage_button_play_press_new.png'),
    pause: require('../assets/images/bt_playpage_button_pause_press_new.png'),
    more: require('../assets/images/bs_ic_more_light.png'),
    next: require('../assets/images/bt_lockscreen_next_press.png'),
    prev: require('../assets/images/bt_lockscreen_prev_press.png'),
    list: require('../assets/images/bt_playpage_button_list_normal_new.png'),
    order: require('../assets/images/bt_playpage_order_normal_new.png'),
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
            <TouchableHighlight onPress={()=>{this.props.onClick()}}
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
