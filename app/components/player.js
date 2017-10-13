import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY, PLAYER_TOGGLE, PLAYER_NOWLIST_CLEAR, PLAYER_NOWLIST_ADD} from "../actions/player";
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder, TouchableHighlight, Slider, FlatList, TouchableWithoutFeedback} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import { BlurView, VibrancyView } from 'react-native-blur';
import styles from '../config/styles'
import {API_REQUEST_SONG_GET} from "../actions/api";


// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;

const template = []

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
                return gestureState.dx != 0 && gestureState.dy != 0;
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
                        toValue: {x: 0, y: -Dimensions.get('window').height},//collapsed ? 0 : -Dimensions.get('window').height},                             // Animate to final value of 1
                    }
                ).start();                                  // Start the animation

            }
        });
    }

    _renderItem = ({index, item}) => {
        switch (index){
        case 0:
            return (
                <View style={{height: Dimensions.get('window').height*0.76, width: Dimensions.get('window').width/3, backgroundColor: '#222222'}}>
                    <Text> page: {index}</Text>
                </View>
            )
        case 1:
            return (
                <View style={{height: Dimensions.get('window').height*0.76, width: Dimensions.get('window').width/3, backgroundColor: '#333333'}}>
                    <Text> page: {index}</Text>
                </View>
            )
        default:
            return (
                <View style={{height: Dimensions.get('window').height*0.76, width: Dimensions.get('window').width/3, backgroundColor: '#444444'}}>
                    <Text> page: {index}</Text>
                </View>
            )
        }
    }


    render() {
        let props = this.props;

        let {pan} = this.state;

        // Calculate the x and y transform from the pan value
        let [translateX, translateY] = [pan.x, pan.y];

        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {transform: [{translateX}, {translateY}]};

        // let song = props.entities.songs['']
        let imageSong = 'http://avatar.nct.nixcdn.com/playlist/2017/10/05/1/c/3/8/1507185683504.jpg'
        let imageSongExpand = imageSong.split('.').pop()
        imageSong = imageSong.replace('.'+imageSongExpand, '_500.'+imageSongExpand)
        if (sound){
            if(isPlaying){
                sound.getCurrentTime((seconds)=>console.log('at'+seconds))
            }
        }

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
                    backgroundColor: 'transparent'
                }}>
                    <Image source={{uri:imageSong}} resizeMode={'cover'} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        height: null,
                        width: null,
                    }}/>
                    <BlurView viewRef={this.state.viewRef} blurType={'light'} blurAmount={10} style={[{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}]}/>
                    <View style={{height:'76%', width: '100%', backgroundColor: 'transparent', position: 'absolute'}}>
                        <FlatList
                            data={['a','b','c']}
                            pagingEnabled={true}
                            keyExtractor={(item) => item.itemId}
                            showsHorizontalScrollIndicator={false}
                            renderItem={this._renderItem}
                            horizontal={true}
                        />
                    </View>
                    <View style={{position:'absolute', bottom: 0, width: '100%', height: '24%'}}>
                        <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/ic_button_like_normal.png')} style={{width:36, height: 36}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/ic_button_like_normal.png')} style={{width:36, height: 36, marginLeft: 16}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/ic_button_like_normal.png')} style={{width:36, height: 36, marginRight: 16, marginLeft: 16}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/ic_button_like_normal.png')} style={{width:36, height: 36, marginRight: 16}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/bs_ic_more_light.png')} style={{width:36, height: 36}}/>
                            </TouchableHighlight>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
                            <Text style={{color:'white'}}>00:00</Text>
                            <Slider style={{width:'72%'}} minimumTrackTintColor={'black'} maximumTrackTintColor={'#666666'} thumbImage={require('../assets/images/bt_playpage_button_progress_normal.png')}/>
                            <Text style={{color:'white'}}>03:00</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/bt_playpage_order_normal_new.png')} style={{width:46, height: 46}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/bt_lockscreen_prev_press.png')} style={{width:46, height: 46, marginLeft: 8}}/>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.props.loadSong('6DHBZXxtNIKG')}
                            >
                                <Image source={require('../assets/images/bt_lockscreen_play_press.png')} style={{width:56, height: 56, marginLeft: 8, marginRight: 8}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/bt_lockscreen_next_press.png')} style={{width:46, height: 46, marginRight: 8}}/>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Image source={require('../assets/images/bt_playpage_button_list_normal_new.png')} style={{width:46, height: 46}}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

export default connect((state, ownProps) => {
    const {player: {isPlaying, nowList, nowAt, collapsed}, entities} = state
    const song = nowList.map((songKey) => entities.songs[songKey])[nowAt] || {
        songTitle: 'Tên',
        artistNamze: 'Artist',
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
    toggleView: () => dispatch(PLAYER_TOGGLE()),
    loadSong: (songId) => {
        console.log('load api song')
        dispatch(API_REQUEST_SONG_GET(songId));
        dispatch(PLAYER_NOWLIST_CLEAR());
        dispatch(PLAYER_NOWLIST_ADD(songId));
        dispatch(PLAYER_PLAY());
    }
}))(Player)