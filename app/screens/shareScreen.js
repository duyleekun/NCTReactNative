/**
 * Created by nguyenphuc on 11/29/17.
 */
import {connect} from "react-redux";
import {FlatList, Image, Text, View, Animated, TouchableOpacity} from "react-native";
import * as React from "react";
import FadeInView from '../components/fadeInView'
import {SHARE_TOGGLE, SHARE_SHOW} from '../actions/share'
import Share from 'react-native-share'

import Dimensions from 'Dimensions';

const shareTemplate = [{name: 'facebook'}, {name: 'email'}, {name: 'sms'}, {name: 'copy'}]

class ShareView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            marginAnim: new Animated.Value(props.marginAnim.hide ? 200: 0),
        }
    }
    componentDidMount(){
        Animated.timing(
            this.state.marginAnim,
            {
                toValue: this.props.marginAnim.hide ? 0: 200,
                duration: 1200
            }
        ).start()
    }
    render(){
        let {marginAnim} = this.state
        return(
            <Animated.View style={{...this.props.style, marginTop: marginAnim}}>
                {this.props.children}
            </Animated.View>
        )
    }
}

class ShareScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTime: 0,
        };
    }

    _renderItemPager = ({item, index}) => {
        const video = this.props.entities.videos[this.props.videoId]
        let shareOptions = {
            title: 'QWork-Nhaccuatui',
            message: video.videoTitle,
            url: video.linkShare,
            subject: 'Share link'
        }
        return(
            <View style={{width: Dimensions.get('window').width/4, height: '100%'}}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}
                    onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{
                        'social': 'facebook'
                    }))}}
                >
                    <View style={{alignItems: 'center'}}>
                        <Image source={require('../assets/images/com_facebook_button_icon_blue.png')} style={{width: '80%', aspectRatio: 1}}/>
                        <Text style={{ marginTop: 4, fontSize: 14, textAlign: 'center', textTransform: 'capitalize', color: 'white'}}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={{
                backgroundColor: 'transparent',
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}>
                <FadeInView
                    style={{backgroundColor: '#00000060', position: 'absolute', width: '100%', height: '100%'}} fadeAnim={{hide: this.props.showAnim}}></FadeInView>
                <ShareView style={{backgroundColor: 'transparent', position: 'absolute', width: '100%', height: '100%'}} marginAnim={{hide: this.props.showAnim}}>
                    <TouchableOpacity onPress={()=>this.props.shareToggle()} style={{flex: 1}}/>
                    <View style={{width: '100%', height: '20%', backgroundColor: 'white', bottom: 0}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, marginTop: 8, marginBottom: 8}}>Chia sẻ</Text>
                        </View>
                        <View style={{backgroundColor: '#888', width: '100%', height: 1}}/>
                        <FlatList
                            data={shareTemplate}
                            renderItem={this._renderItemPager.bind(this)}
                            keyExtractor={item => item.name}
                            style={{flex: 1, backgroundColor: 'green'}}
                            horizontal={true}
                        />
                    </View>
                </ShareView>
            </View>
        )
    }
}


export default connect(
(state, ownProps)=>{
        const {share: {showAnim}} = state
    const {videoplayer: {collapsed, isPlaying, videoId, fullScreen}, entities} = state
    return {showAnim, videoId, entities}
    }, (dispatch, ownProps)=>({
        shareToggle:()=>{
            dispatch(SHARE_SHOW(false));
        }
    }))(ShareScreen)