/**
 * Created by nguyenphuc on 9/28/17.
 */
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import Dimensions from 'Dimensions';

export default class AlbumCell extends React.PureComponent{

    _onPress = () => {
        // this.props._onPressItem(this.props.id)
    }

    render(){
        let props = this.props
        return (<View>
            <View style={{width: Dimensions.get('window').width/3, aspectRatio: 1}}>
            <Image source={{uri: 'http://avatar.nct.nixcdn.com/playlist/2017/05/10/b/d/4/4/1494409311789.jpg'}} style={{width: '100%', height: '100%'}}/>
            </View>
            <View>
                <Text>nguyen Huu Phuc</Text>
            </View>
        </View>)
    }
}