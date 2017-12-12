import {connect} from "react-redux"
import {VIDEOPLAYER_TOGGLE, VIDEOPLAYER_HIDDEN, VIDEOPLAYER_PAUSE, VIDEOPLAYER_FULLSCREEN, VIDEOPLAYER_ADD} from "../actions/videoPlayer";
import {API_REQUEST_VIDEO_RELATION, API_REQUEST_SONG_RELATION, API_REQUEST_SONG_LYRIC, API_REQUEST_SONG_GET, API_REQUEST_VIDEO_GET} from '../actions/api'
import {PLAYER_TOGGLE, PLAYER_NOWLIST_ADD, PLAYER_NOWLIST_CLEAR, PLAYER_PLAY} from '../actions/player'
import {SHARE_TOGGLE} from '../actions/share'
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder, FlatList, Slider, TouchableHighlight, StatusBar} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import Video from "react-native-video";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import Styles from '../assets/styles/videoPlayerStyle'
import {ListItem, Left, Icon, Right, Title } from "native-base";
import {keyFromAction} from "../lib/action_utilities";
import PlayListTouchableBtn from "./playListTouchableBtnComponent";
import ImgButton from './imgButton'
import SystemSetting from 'react-native-system-setting'
import Orientation from 'react-native-orientation';

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

class Player extends React.Component {

    videoRelation = []
    videoDuration = 0
    videoCurrentTime = 0
    volume = 0
    minX = 0
    maxX = 0
    minY = 0
    maxY = 0
    panCurrentSeek = 0

    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
            stickyHeaderIndices: [],
        };
    }

    componentWillMount() {
        SystemSetting.getVolume().then((volume)=>{
            this.volume = volume
        });
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => {
                return true
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log('dx : ' + gestureState.dx)
                console.log('dy : ' + gestureState.dy)
                if (this.props.fullScreen){
                    return gestureState.dx != 0 && gestureState.dy != 0
                } else {
                    return (Math.abs(gestureState.dy) > Math.abs(gestureState.dx))//&& Math.max([Math.abs(gestureState.dx), Math.abs(gestureState.dy)]) < 10
                }
            },

            onPanResponderGrant: (e, gestureState) => {
                if (this.props.fullScreen == false){
                    this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
                    this.state.pan.setValue({x: 0, y: 0});
                }
            },

            onPanResponderMove:(event, gestureState)=>{
                console.log('on move')
                if (this.props.fullScreen == false){
                    return Animated.event([
                        null, {dx: 0, dy: this.state.pan.y},
                    ])
                } else {
                    console.log('dx : ' + gestureState.dx)
                    console.log('dy : ' + gestureState.dy)
                    if (Math.abs(gestureState.dx)>Math.abs(gestureState.dy)){
                        if (gestureState.dx>0){
                            if (gestureState.dx>this.maxX){
                                console.log('max 1')
                                this.maxX = gestureState.dx
                                this.panCurrentSeek = this.panCurrentSeek < this.videoDuration ? this.panCurrentSeek + (this.videoDuration/100): this.videoDuration - 1
                            } else {
                                console.log('max 2')
                                this.panCurrentSeek = this.panCurrentSeek > 0 ? this.panCurrentSeek - (this.videoDuration/100): 0
                            }
                        } else {
                            if (gestureState.dx<this.minX){
                                console.log('min 1')
                                this.minX = gestureState.dx
                                this.panCurrentSeek = this.panCurrentSeek < this.videoDuration ? this.panCurrentSeek + (this.videoDuration/100): this.videoDuration - 1
                            } else {
                                console.log('min 2')
                                this.panCurrentSeek = this.panCurrentSeek > 0 ? this.panCurrentSeek - (this.videoDuration/100): 0
                            }
                        }
                        console.log('seek time: ' + this.panCurrentSeek)
                        this.videoPlayer.seek(this.panCurrentSeek)
                    } else {
                        if (gestureState.dy>0){
                            if (gestureState.dy>this.maxY){
                                this.maxY = gestureState.dy
                                this.volume = this.volume > 0 ? this.volume - 0.01: 0
                            } else {
                                this.volume = this.volume < 1 ? this.volume + 0.01: 1
                            }
                        } else {
                            if (gestureState.dy<this.minY){
                                this.minY = gestureState.dy
                                this.volume = this.volume < 1 ? this.volume + 0.01: 1
                            } else {
                                this.volume = this.volume > 0 ? this.volume - 0.01: 0
                            }
                        }
                        console.log('volume : ' + this.volume)
                        SystemSetting.setVolume(this.volume)
                    }
                }
            },

            onPanResponderRelease: (e, {vx, vy}) => {
                // Flatten the offset to avoid erratic behavior
                this.minX = 0
                this.maxX = 0
                this.minY = 0
                this.maxY = 0
                console.log('reset pangesture')
                const {pan} = this.state
                const {collapsed} = this.props
                console.log('collapsed: ' + collapsed)
                if (this.props.fullScreen == false){
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
            }
        });
    }

    componentDidUpdate() {
        const {collapsed} = this.props
        Animated.spring(                            // Animate value over time
            this.state.pan,                      // The value to drive
            {
                velocity: {x: 0, y: 0},
                // deceleration: {x: 1, y:1},
                // toValue: {x: 0, y: -Dimensions.get('window').height},
                toValue: {x: 0, y: (collapsed ? 0 : -Dimensions.get('window').height)}, // Animate to final value of 1
            }
        ).start();

        if (this.props.fullScreen){
            Orientation.lockToLandscapeRight()
        } else {
            Orientation.lockToPortrait()
        }
        Orientation.unlockAllOrientations()
    }

    _renderItem = ({item, index})=>{
        let video = this.props.entities.videos[item.data]
        if (item.header){
            return (<ListItem style={{ marginLeft: 0, backgroundColor: 'white', width: Dimensions.get('window').width, height: 60}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: video.artistImage}} style={{ marginLeft: 8, marginRight: 8, width: 44, height: 44, borderRadius: 22}}/>
                    <Text stype={Styles.title}>{video.artistName}</Text>
                </View>
            </ListItem>)
        } else {
            return(
                <ListItem style={{marginLeft: 0, width: Dimensions.get('window').width, height: 60}}>
                    <TouchableHighlight onPress={()=>{this.props.loadVideo(video.videoKey)}}>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <View>
                                <Image source={{uri:video.videoImage}} style={{marginLeft: 8, height: 52, aspectRatio: 4/3}}/>
                            </View>
                            <View style={{justifyContent: 'center', marginLeft: 8}}>
                                <Text style={Styles.title}>{video.videoTitle}</Text>
                                <Text style={Styles.artist}>{video.artistName}</Text>
                                <Text style={Styles.artist}>{video.view}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </ListItem>
            )
        }
    }

    PlayerBottomControl(){
        const video = this.props.entities.videos[this.props.videoId]

        if (this.props.collapsed == false){
            return (
                <View style={{position: 'absolute', bottom: 0, width: '100%', height: '20%', backgroundColor: '#00000040', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{width: '100%', height: '20%', flexDirection: 'row', display: 'flex'}}>
                        <View style={{width: '60%', height: '100%', marginLeft: 0,alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                            <Text style={{flex: 1, fontSize: 10, color: '#fff', marginLeft: 2, textAlign: 'center'}}>{this.fancyTime(parseInt(this.videoCurrentTime))}</Text>
                            <Slider style={{width:'60%', alignSelf: 'center'}}
                                    minimumTrackTintColor={'black'}
                                    maximumTrackTintColor={'#666666'}
                                    thumbImage={require('../assets/images/bt_playpage_button_progress_normal.png')}
                                    value={this.videoCurrentTime/this.videoDuration}
                                     onValueChange={val => {
                                         this.videoPlayer.seek(val*this.videoDuration)
                                    }}
                            />
                            <Text style={{flex: 1, fontSize: 10, color: '#fff', marginRight: 2, textAlign: 'center'}}>{this.fancyTime(parseInt(this.videoDuration))}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <ImgButton style={{marginRight: 8, height: 36, aspectRatio: 1}} img={'setting'} onClick={()=>this.props.setFullScreen(true)}/>
                            <ImgButton style={{marginRight: 8, height: 36, aspectRatio: 1}} img={'download'} onClick={()=>{
                                this.props.setFullScreen(!this.props.fullScreen)
                            }}/>
                        </View>
                    </View>
                </View>
            )
        }
    }

    PlayerTopControl(){
        if (this.props.collapsed == false){
            const video = this.props.entities.videos[this.props.videoId]
            return(
                <View style={{position: 'absolute', display: 'flex', flexDirection: 'row', top: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000040', width: '100%', height: '20%'}}>
                    {this.props.fullScreen ? (<Text style={{fontSize: 14, color: 'white'}}>{video.videoTitle}</Text>):(<ImgButton img={'hide'} style={{marginLeft: 8, width: 36, height: 36}} onClick={()=>this.props.toggleView()}/>)}
                    <View style={{flex: 1}}/>
                    {this.props.fullScreen ? (<ImgButton img={'download'} style={{marginRight: 8, width: 36, height: 36}}/>): null}
                    {this.props.fullScreen ? (<ImgButton img={'download'} style={{marginRight: 8, width: 36, height: 36}} onClick={()=>this.props.shareToggle()}/>): null}
                    <ImgButton img={'like'} style={{marginRight: 8, width: 36, height: 36}}/>
                </View>
            )
        }
    }

    playerOnProgress = (progress)=>{
        this.videoCurrentTime = progress.currentTime
        // this.videoDuration = progress.playableDuration
        this.forceUpdate();
    }

    fancyTime(value) {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
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
        let streamurl = ''
        const video = this.props.entities.videos[this.props.videoId]
        if (this.videoRelation.length==0){
            this.videoRelation.push({header: true, data:this.props.videoId})
            this.props.getRelativeVideo(this.props.videoId)
        } else {
            this.videoRelation = [{header: true, data:this.props.videoId}]
            let {[keyFromAction(API_REQUEST_VIDEO_RELATION(this.props.videoId))] : videosRes = []} = this.props.entities
            videosRes.map((value, index)=>{
                this.videoRelation.push({header: false, data: value})
            })
        }
        if (video.streamURL.length > 0){
            streamurl = video.streamURL[video.streamURL.length-1].stream
        }
        this.videoDuration = video.time
        return (
            <Animated.View style={{
                transform: [{translateY: translateAnim}],
                overflow: "visible",
                position: 'absolute',
                right: rightAnim,
                bottom: bottomMargin,
                width: widthAnim,
                aspectRatio: aspectRatioAnim,
                backgroundColor: 'white'
            }} {...this._panResponder.panHandlers} clipsToBounds={false}>
                <StatusBar hidden={!this.props.collapsed}/>
                <View style={{alignItems: 'center', justifyContent: 'center', position: 'relative', top: 0, width: '100%', aspectRatio: aspectRatio, zIndex: 10}}>
                    {streamurl.length > 0 ? (<Video resizeMode='cover' source={{uri: streamurl}}
                                                    ref = {ref=>this.videoPlayer=ref}
                                                    style={{width: '100%', height: '100%', position: 'absolute'}}
                                                    paused={this.props.isPlaying}
                                                    progressUpdateInterval={250.0}
                                                    onProgress={this.playerOnProgress.bind(this)}
                                                    onend={()=>this.props.loadVideo(this.videoRelation[0].videoKey)}
                    />) : (<View style={{width: '100%', height: '100%', position: 'absolute'}}></View>)}
                    {this.PlayerTopControl()}
                    <PlayListTouchableBtn size={36} img={'play'} onClick={()=>this.props.pause()} style={{position: 'absolute'}}/>
                    {this.PlayerBottomControl()}
                </View>
                <Animated.View style={{width: windowWidth, opacity: opacityAnim, backgroundColor: 'white'}}>
                    <View style={{width: '100%', height: 80, display: 'flex',flexDirection: 'row' , alignItems:'center'}}>
                        <View style={{marginLeft: 8, flex: 1}}>
                            <Text style={Styles.title}>{video.videoTitle}</Text>
                            <Text style={Styles.artist}>{video.artistName}</Text>
                            <Text style={Styles.artist}>{video.view}</Text>
                        </View>
                        <View style={{marginRight: 8, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <ImgButton style={{height: 36, aspectRatio: 1, marginRight: 8}} img={'download'} onClick={()=>this.props.loadSong(video.songKey)}/>
                            <ImgButton style={{height: 36, aspectRatio: 1, marginRight: 8}} img={'download'} onClick={()=>this.props.showShareScreen()}/>
                            <ImgButton style={{height: 36, aspectRatio: 1, marginRight: 8}} img={'download'} onClick={()=>this.props.setFullScreen(true)}/>
                        </View>
                    </View>
                    <View>

                    </View>
                    <FlatList
                        data={this.videoRelation.slice()}
                        pagingEnabled={true}
                        keyExtractor={item => item.data}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this._renderItem.bind(this)}
                        horizontal={false}
                        stickyHeaderIndices = {this.state.stickyHeaderIndices}
                        // onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                    />
                </Animated.View>
            </Animated.View>
        )
    }
}

export default connect((state, ownProps) => {
    const {videoplayer: {collapsed, isPlaying, videoId, fullScreen}, entities} = state
    return {entities, collapsed, isPlaying, videoId, fullScreen}
}, (dispatch, ownProps) => ({
    toggleView:()=>{
        dispatch(VIDEOPLAYER_TOGGLE())
    },
    getRelativeVideo:(videoId)=>{
        dispatch(API_REQUEST_VIDEO_RELATION(videoId))
    },
    loadSong: (songId) => {
        dispatch(VIDEOPLAYER_HIDDEN())
        dispatch(API_REQUEST_SONG_GET(songId));
        dispatch(API_REQUEST_SONG_RELATION(songId));
        dispatch(API_REQUEST_SONG_LYRIC(songId));
        dispatch(PLAYER_NOWLIST_CLEAR());
        dispatch(PLAYER_NOWLIST_ADD(songId));
        dispatch(PLAYER_PLAY());
        dispatch(PLAYER_TOGGLE);
    },
    pause:()=>{
        dispatch(VIDEOPLAYER_PAUSE());
    },
    setFullScreen:(isFull)=>{
        dispatch(VIDEOPLAYER_FULLSCREEN(isFull))
    },
    loadVideo:(videoId)=>{
        dispatch(API_REQUEST_VIDEO_GET(videoId));
        dispatch(VIDEOPLAYER_ADD(videoId));
        dispatch(API_REQUEST_VIDEO_RELATION(videoId))
    },
    showShareScreen:()=>{
        dispatch(SHARE_TOGGLE())
    }
}))(Player)