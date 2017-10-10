import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY, PLAYER_TOGGLE} from "../actions/player";
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import Video from "react-native-video";

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
            onMoveShouldSetPanResponderCapture: () => true,

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

                // console.log(vx, vy);
                // if (Math.abs(vy) > 1 || Math.abs(this.state.pan.y._value) > 100) {
                //     this.props.toggleView()
                // }
                // Animated.spring(                            // Animate value over time
                //     this.state.pan,                      // The value to drive
                //     {
                //         velocity: {x: 0, y: vy},
                //         // deceleration: {x: 1, y:1},
                //         toValue: {x: 0, y: collapsed ? 0 : -Dimensions.get('window').height},                             // Animate to final value of 1
                //     }
                // ).start();                                  // Start the animation

            }
        });
    }

    render() {
        let props = this.props;
        let {pan: {y: translateY}} = this.state;
        const {width: windowWidth, height: windowHeight} = Dimensions.get('window')
        const bottomMargin = 60
        const inputRange = [-windowHeight / 2,0]
        const aspectRatio = 16/9
        const videoComponentMaxHeight = windowWidth/aspectRatio
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
            outputRange: [-(windowHeight - bottomMargin - videoComponentMaxHeight), 0],
            extrapolate: 'clamp'
        })
        return (
            <Animated.View style={{
                transform: [{translateY: translateAnim}],
                overflow: "visible",
                position: 'absolute',
                right: rightAnim,
                bottom: bottomMargin,
                width: widthAnim,
                aspectRatio: aspectRatio,
                backgroundColor: 'blue'
            }} {...this._panResponder.panHandlers} clipsToBounds={false}>
                <Video source={{uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
                style={{width: '100%', height: '100%'}}/>
                <Animated.View style={{width: windowWidth, height: windowHeight - (videoComponentMaxHeight), opacity: opacityAnim, backgroundColor: 'blue'}}>
                    <Text>Lau xanh hen tai player</Text>
                </Animated.View>
            </Animated.View>
        )
    }
}

export default connect((state, ownProps) => {
    return {}
}, (dispatch, ownProps) => ({}))(Player)