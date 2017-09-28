/**
 * Created by nguyenphuc on 9/28/17.
 */
import {Component} from 'react'
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";

export class AlbumCell extends Component{
    render(){
        let props = this.props
        return (<TouchableWithoutFeedback /*onPress={() => props.gotoSong(item)}*/>
            <View style={{width: Dimensions.get('window').width, aspectRatio: 619 / 250}}>
            <Image source={{uri: item.image}} style={{width: '100%', height: '100%'}}/>
            </View>
            <View>
                <Text>{item.songTitle}</Text>
            </View>
        </TouchableWithoutFeedback>)
    }
}