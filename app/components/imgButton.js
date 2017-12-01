/**
 * Created by nguyenphuc on 12/1/17.
 */
import {Image, Text, TouchableHighlight, View} from "react-native";
import * as React from "react";

const thumbnails = {
    like: require("../assets/images/ic_button_like_normal.png"),
    hide: require('../assets/images/bt_playpage_button_return_normal.png'),
    facebook: require('../assets/images/com_facebook_button_icon_blue.png'),
    setting: require('../assets/images/ic_btn_playpage_button_setting_normal.png'),
    download: require("../assets/images/ic_btn_download_normal.png"),
};
export default class ImgButton extends React.Component {

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
                                style={{...props.style}}
                                onHideUnderlay={()=>{this.setState({pressed: false})}}
                                onShowUnderlay={()=>{this.setState({pressed: true})}}>
                <View style={{width: '100%', height: '100%'}}>
                    <Image
                        style={{tintColor: this.state.pressed ? '#32AAEA' : null, width: '100%', height: '100%'}}
                        source={this.getImage(props.img)}
                    />
                </View>
            </TouchableHighlight>
        );
    }
}
