import {connect} from "react-redux"
import {VIDEOPLAYER_TOGGLE} from "../actions/videoPlayer";
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder, FlatList} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import Video from "react-native-video";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import Styles from '../assets/styles/videoPlayerStyle'

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;


class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
        };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log('dx : ' + gestureState.dx)
                console.log('dy : ' + gestureState.dy)

                return true// (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) && this.pageIndex == 0 //&& Math.max([Math.abs(gestureState.dx), Math.abs(gestureState.dy)]) < 10
            },

            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
                this.state.pan.setValue({x: 0, y: 0});
            },

            onPanResponderMove: Animated.event([
                null, {dx: 0, dy: this.state.pan.y},
            ]),

            onPanResponderRelease: (e, {vx, vy}) => {
                // Flatten the offset to avoid erratic behavior
                const {pan} = this.state
                const {collapsed} = this.props
                pan.flattenOffset();

                console.log(vx, vy);
                if (Math.abs(vy) > 1 || Math.abs(this.state.pan.y._value) > 100) {
                    this.props.toggleView()
                }
                Animated.spring(                            // Animate value over time
                    this.state.pan,                      // The value to drive
                    {
                        velocity: {x: 0, y: vy},
                        // deceleration: {x: 1, y:1},
                        toValue: {x: 0, y: collapsed ? 0 : -Dimensions.get('window').height},                             // Animate to final value of 1
                    }
                ).start();                                  // Start the animation

            }
        });
    }

    _renderItem = ({item, index})=>{
        return(
            <View style={{width: Dimensions.get('window').width, height: 80}}>
                <Image source={{uri:'google.com'}}/>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                        <Image source={{uri:'http://avatar.nct.nixcdn.com/mv/2017/11/12/d/4/3/9/1510502987683.jpg'}} style={{marginLeft: 8, height: 72, aspectRatio: 4/3}}/>
                    </View>
                    <View style={{justifyContent: 'center', marginLeft: 8}}>
                        <Text style={Styles.title}>Bai Hat</Text>
                        <Text style={Styles.artist}>Ca sy</Text>
                        <Text>Views</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        let props = this.props;
        let {pan: {y: translateY}} = this.state;
        const {width: windowWidth, height: windowHeight} = Dimensions.get('window')
        const bottomMargin = 60
        const inputRange = [-windowHeight / 2,0]
        const aspectRatio = 16/9
        const videoComponentMaxHeight = windowWidth/aspectRatio
        const videoComponentMinHeight = windowWidth/2/aspectRatio
        let widthAnim = translateY.interpolate({
            inputRange: inputRange,
            outputRange: ['100%', '50%'],
            extrapolate: 'clamp'
        });
        let rightAnim = translateY.interpolate({
            inputRange: inputRange,
            outputRange: [0, 10],
            extrapolate: 'clamp'
        });
        let opacityAnim = translateY.interpolate({
            inputRange: inputRange,
            outputRange: [1.0, 0],
            extrapolate: 'clamp'
        });
        let translateAnim = translateY.interpolate({
            inputRange: inputRange,
            outputRange: [bottomMargin, 0],
            extrapolate: 'clamp'
        })
        let aspectRatioAnim = translateY.interpolate({
            inputRange: inputRange,
            outputRange: [windowWidth/windowHeight,aspectRatio],
            extrapolate: 'clamp'
        })
        // let streamurl = ''
        // if (this.props.videoId.length > 0){
        //     let video = this.props.entities.videos[this.props.videoId]
        //     if (video.streamURL.length > 0){
        //         streamurl = video.streamURL.pop()
        //     }
        // }
        return (
            <Animated.View style={{
                transform: [{translateY: translateAnim}],
                overflow: "visible",
                position: 'absolute',
                right: rightAnim,
                bottom: bottomMargin,
                width: widthAnim,
                aspectRatio: aspectRatioAnim,
                backgroundColor: 'green'
            }} {...this._panResponder.panHandlers} clipsToBounds={false}>
                <Video resizeMode='cover' source={{uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
                style={{width: '100%', aspectRatio: aspectRatio}}/>
                <Animated.View style={{width: windowWidth, opacity: opacityAnim, backgroundColor: 'white'}}>
                    <View style={{width: '100%', height: 80, display: 'flex',flexDirection: 'row' , alignItems:'center'}}>
                        <View style={{marginLeft: 8, flex: 1}}>
                            <Text style={Styles.title}>Bai Hat Cua Em</Text>
                            <Text style={Styles.artist}>Ca si</Text>
                        </View>
                        <View style={{marginRight: 8, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
                        </View>
                    </View>
                    <View>

                    </View>
                    <FlatList
                        data={['a','b','c']}
                        pagingEnabled={true}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this._renderItem.bind(this)}
                        horizontal={false}
                        // onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                    />
                </Animated.View>
            </Animated.View>
        )
    }
}

export default connect((state, ownProps) => {
    const {videoplayer: {collapsed, isPlaying, videoId}, entities} = state
    return {entities, collapsed, isPlaying, videoId}
}, (dispatch, ownProps) => ({
    toggleView:()=>{
        dispatch(VIDEOPLAYER_TOGGLE())
    }
}))(Player)