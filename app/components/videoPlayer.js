import {connect} from "react-redux"
import {VIDEOPLAYER_TOGGLE, VIDEOPLAYER_HIDDEN, VIDEOPLAYER_PAUSE, VIDEOPLAYER_FULLSCREEN} from "../actions/videoPlayer";
import {API_REQUEST_VIDEO_RELATION, API_REQUEST_SONG_RELATION, API_REQUEST_SONG_LYRIC, API_REQUEST_SONG_GET} from '../actions/api'
import {PLAYER_TOGGLE, PLAYER_NOWLIST_ADD, PLAYER_NOWLIST_CLEAR, PLAYER_PLAY} from '../actions/player'
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder, FlatList, Slider} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import Video from "react-native-video";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import Styles from '../assets/styles/videoPlayerStyle'
import {ListItem, Left, Icon, Right, Title } from "native-base";
import {keyFromAction} from "../lib/action_utilities";
import PlayListTouchableBtn from "./playListTouchableBtnComponent";

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;


class Player extends React.Component {

    videoRelation = []
    videoDuration = 0
    videoCurrentTime = 0

    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            stickyHeaderIndices: [],
            sliderProgress: 0,
        };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log('dx : ' + gestureState.dx)
                console.log('dy : ' + gestureState.dy)

                return (Math.abs(gestureState.dy) > Math.abs(gestureState.dx))//&& Math.max([Math.abs(gestureState.dx), Math.abs(gestureState.dy)]) < 10
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
                console.log('collapsed: ' + collapsed)
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
                </ListItem>
            )
        }
    }

    playerOnProgress = (progress)=>{
        this.videoCurrentTime = progress.currentTime
        this.videoDuration = progress.playableDuration
        this.setState({sliderProgress: parseFloat(progress.currentTime/progress.playableDuration)})
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
                <View style={{alignItems: 'center', justifyContent: 'center', position: 'relative', top: 0, width: '100%', aspectRatio: aspectRatio}}>
                    {streamurl.length > 0 ? (<Video resizeMode='cover' source={{uri: streamurl}}
                                                    style={{width: '100%', height: '100%', position: 'absolute'}}
                                                    paused={this.props.isPlaying}
                                                    fullscreen={this.props.fullScreen}
                                                    progressUpdateInterval={250.0}
                                                    onProgress={this.playerOnProgress.bind(this)}
                    />) : (<View style={{width: '100%', height: '100%', position: 'absolute'}}></View>)}
                    <PlayListTouchableBtn size={36} img={'play'} onClick={()=>this.props.pause()} style={{position: 'absolute'}}/>
                <View style={{position: 'absolute', bottom: 0, width: '100%', height: '20%', backgroundColor: '#00000040', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{width: '100%', height: '20%', flexDirection: 'row', display: 'flex'}}>
                        <View style={{width: '60%', height: '100%', marginLeft: 0,alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                            <Text style={{flex: 1, fontSize: 10, color: '#fff', marginLeft: 2, textAlign: 'center'}}>{this.fancyTime(parseInt(this.videoCurrentTime))}</Text>
                            <Slider style={{width:'60%', alignSelf: 'center'}}
                                    minimumTrackTintColor={'black'}
                                    maximumTrackTintColor={'#666666'}
                                    thumbImage={require('../assets/images/bt_playpage_button_progress_normal.png')}
                                    value={this.state.sliderProgress}
                                // onValueChange={val => {
                                //     if (this.props.song.duration>0){
                                //         this.timer = null
                                //         sound.setCurrentTime(val*this.props.song.duration)
                                //         this.addTimer()
                                //     }
                                // }}
                            />
                            <Text style={{flex: 1, fontSize: 10, color: '#fff', marginRight: 2, textAlign: 'center'}}>{this.fancyTime(parseInt(this.videoDuration))}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue', display: 'flex', flexDirection: 'row'}}>
                            <PlaylistTouchableBtn style={{position: 'absolute', right: 2, width: 26, height: 26}} size={26} img={'download'} onClick={()=>this.props.setFullScreen(true)}/>
                            <PlaylistTouchableBtn style={{position: 'absolute', right: 2, width: 26, height: 26}} size={26} img={'download'} onClick={()=>this.props.setFullScreen(true)}/>
                            <PlaylistTouchableBtn style={{position: 'absolute', right: 2, width: 26, height: 26}} size={26} img={'download'} onClick={()=>this.props.setFullScreen(true)}/>
                        </View>
                    </View>
                </View>
                </View>
                <Animated.View style={{width: windowWidth, opacity: opacityAnim, backgroundColor: 'white'}}>
                    <View style={{width: '100%', height: 80, display: 'flex',flexDirection: 'row' , alignItems:'center'}}>
                        <View style={{marginLeft: 8, flex: 1}}>
                            <Text style={Styles.title}>Bai Hat Cua Em</Text>
                            <Text style={Styles.artist}>Ca si</Text>
                        </View>
                        <View style={{marginRight: 8, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <PlaylistTouchableBtn size={32} img={'download'} onClick={()=>this.props.loadSong(video.songKey)}/>
                            <PlaylistTouchableBtn size={32} img={'download'} onClick={()=>this.props.setFullScreen(true)}/>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
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
    }
}))(Player)