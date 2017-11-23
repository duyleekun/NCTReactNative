import {connect} from "react-redux"
import {VIDEOPLAYER_TOGGLE, VIDEOPLAYER_HIDDEN} from "../actions/videoPlayer";
import {API_REQUEST_VIDEO_RELATION, API_REQUEST_SONG_RELATION, API_REQUEST_SONG_LYRIC, API_REQUEST_SONG_GET} from '../actions/api'
import {PLAYER_TOGGLE, PLAYER_NOWLIST_ADD, PLAYER_NOWLIST_CLEAR, PLAYER_PLAY} from '../actions/player'
import React from "react";
import {Button, Image, Text, View, Animated, PanResponder, FlatList} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import Video from "react-native-video";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import Styles from '../assets/styles/videoPlayerStyle'
import {ListItem, Left, Icon, Right, Title } from "native-base";
import {keyFromAction} from "../lib/action_utilities";

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;


class Player extends React.Component {

    videoRelation = []

    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            stickyHeaderIndices: [],
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
        let temp = []
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
        temp = this.videoRelation.slice()

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
                {streamurl.length > 0 ? (<Video resizeMode='cover' source={{uri: streamurl}}
                                                style={{width: '100%', aspectRatio: aspectRatio}}/>) : (<View style={{width: '100%', aspectRatio: aspectRatio, backgroundColor: 'red'}}/>)}
                <Animated.View style={{width: windowWidth, opacity: opacityAnim, backgroundColor: 'white'}}>
                    <View style={{width: '100%', height: 80, display: 'flex',flexDirection: 'row' , alignItems:'center'}}>
                        <View style={{marginLeft: 8, flex: 1}}>
                            <Text style={Styles.title}>Bai Hat Cua Em</Text>
                            <Text style={Styles.artist}>Ca si</Text>
                        </View>
                        <View style={{marginRight: 8, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <PlaylistTouchableBtn size={32} img={'download'} onClick={()=>this.props.loadSong(video.songKey)}/>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
                            <PlaylistTouchableBtn size={32} img={'download'}/>
                        </View>
                    </View>
                    <View>

                    </View>
                    <FlatList
                        data={temp}
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
    const {videoplayer: {collapsed, isPlaying, videoId}, entities} = state
    return {entities, collapsed, isPlaying, videoId}
}, (dispatch, ownProps) => ({
    toggleView:()=>{
        dispatch(VIDEOPLAYER_TOGGLE())
    },
    getRelativeVideo:(videoId)=>{
        dispatch(API_REQUEST_VIDEO_RELATION(videoId))
    },
    loadSong: (songId) => {
        dispatch(VIDEOPLAYER_TOGGLE())
        dispatch(API_REQUEST_SONG_RELATION(songId));
        dispatch(API_REQUEST_SONG_LYRIC(songId));
        dispatch(API_REQUEST_SONG_GET(songId));
        dispatch(PLAYER_NOWLIST_CLEAR());
        dispatch(PLAYER_NOWLIST_ADD(songId));
        dispatch(PLAYER_PLAY());
        dispatch(PLAYER_TOGGLE);
    }
}))(Player)