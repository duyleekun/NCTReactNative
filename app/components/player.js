import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY, PLAYER_TOGGLE} from "../actions/player";
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';

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

    render() {
        let props = this.props;

        let {pan} = this.state;

        // Calculate the x and y transform from the pan value
        let [translateX, translateY] = [pan.x, pan.y];

        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {transform: [{translateX}, {translateY}]};


        return (
            <Animated.View style={{
                ...imageStyle, overflow: "visible", position: 'absolute', bottom: -Dimensions.get('window').height, width: '100%'
            }} {...this._panResponder.panHandlers} clipsToBounds={false}>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'yellow'
                }}>
                    <Image style={{height: '100%', aspectRatio: 1, backgroundColor: 'red'}}/>
                    {props.isPlaying ? (<Button title="Playing" onPress={props.pause}/>) : (
                        <Button title="Paused" onPress={props.play}/>)}
                    <Button title="Next" onPress={props.next}/>
                    <View style={{flex: 1}}>
                        <Text>{props.song.songTitle}</Text>
                        <Text>{props.song.artistName}</Text>
                    </View>
                </View>

                <View style={{
                    height: Dimensions.get('window').height,
                    width: '100%',
                    backgroundColor: 'red'
                }}>
                    {/*Detail view of the song*/}
                    <Text>Lau Xanh</Text>
                </View>
            </Animated.View>
        )
    }
}

export default connect((state, ownProps) => {
    const {player: {isPlaying, nowList, nowAt, collapsed}, entities} = state
    const song = nowList.map((songKey) => entities.songs[songKey])[nowAt] || {
        songTitle: 'Tên',
        artistName: 'Artist',
        streamURL: []
    }

    if (song.streamURL.length > 0) {
        if (sound === null || (sound._filename !== song.streamURL[0].stream)) {
            if (sound) {
                sound.release()
            }
            sound = new Sound(song.streamURL[0].stream, '', error => {
                if (error) {
                    console.log(error)
                }
                sound.play()
            })
        }
    }

    if (sound) {
        if (isPlaying) {
            sound.play((msg) => {
                console.log(msg)
            })
        } else {
            sound.pause()
        }
    }
    return {isPlaying, nowAt, song, collapsed}
}, (dispatch, ownProps) => ({
    play: () => dispatch(PLAYER_PLAY()),
    pause: () => dispatch(PLAYER_PAUSE()),
    next: () => dispatch(PLAYER_NOWLIST_NEXT()),
    toggleView: () => dispatch(PLAYER_TOGGLE())
}))(Player)