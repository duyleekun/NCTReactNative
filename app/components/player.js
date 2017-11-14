'use trict';

import {connect} from "react-redux"
import {PLAYER_NOWLIST_NEXT, PLAYER_PAUSE, PLAYER_PLAY, PLAYER_TOGGLE, PLAYER_NOWLIST_CLEAR, PLAYER_NOWLIST_ADD, PLAYER_UPDATE_TIME, PLAYER_NOWLIST_PREVIOUS} from "../actions/player";
import React from "react";
import { Image, Text, View, Animated, PanResponder, ScrollView, Slider, FlatList} from "react-native";
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import { BlurView } from 'react-native-blur';
import {ListItem, Left, Icon, Right, Title } from "native-base";
import {API_REQUEST_SONG_GET, API_REQUEST_SONG_RELATION, API_REQUEST_SONG_LYRIC, API_LOAD_LYRICS} from "../actions/api";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import {keyFromAction} from "../lib/action_utilities";
import arc4 from '../lib/arc4'

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let sound = null;

const template = []
const pager = [
        {name: 'Nghệ sĩ - PLaylist', header: true, data:''}
        ]

class Player extends React.Component {

    timer = null
    pageIndex = 0
    playPosition = 0
    jsonLyrics = []
    lyricContentHeight = 0

    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            currentTime: 0,
            stickyHeaderIndices: [],
        };
    }
    componentDidMount(){

    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log('dx : ' + gestureState.dx)
                console.log('dy : ' + gestureState.dy)

                return (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) && this.pageIndex == 0 //&& Math.max([Math.abs(gestureState.dx), Math.abs(gestureState.dy)]) < 10
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
                        // toValue: {x: 0, y: -Dimensions.get('window').height},
                        toValue: {x: 0, y: (collapsed ? 0 : -Dimensions.get('window').height)}, // Animate to final value of 1
                    }
                ).start();                                  // Start the animation

            }
        });
    }

    fancyTime(value) {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
    }

    _renderItemPager = ({item}) => {
        if (item.header) {
            return (
                <ListItem itemDivide style={{marginLeft: 0, position:'relative'}}>
                    <View style={{ backgroundColor:'#ffffff50', position: 'absolute'}}/>
                    <Text style={{ marginLeft: 16, fontWeight: "bold", color: '#666666', position: 'absolute', backgroundColor:'transparent'}}>
                        {item.name}
                    </Text>
                </ListItem>
            );
        } else {
            let playlistRelate = this.props.entities.playlists[item.data]
            return (
                <ListItem style={{marginLeft: 0, backgroundColor: 'transparent'}}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginLeft: 8}}>
                    <Image source={{uri: playlistRelate.playlistImage}} style={{width: 40, height: 40}}/>
                    <View style={{marginLeft: 8, display: 'flex', flexDirection: 'column', flex: 1}}>
                        <Text style={{flex:1}} numberOfLines={1} ellipsizeMode={'tail'}>{playlistRelate.playlistTitle}</Text>
                        <Text style={{flex:1}} numberOfLines={1} ellipsizeMode={'tail'}>{playlistRelate.artistName}</Text>
                    </View>
                    </View>
                </ListItem>
            );
        }
    }

    _renderItem = ({item, index}) => {

        switch (index){
        case 0:
            var dataRelation = pager.slice()
            let {[keyFromAction(API_REQUEST_SONG_RELATION(this.props.song.songKey))] : playlistRelatedResponse = []} = this.props.entities
            playlistRelatedResponse.map((value, index)=>{
                dataRelation.push({name: '', header: false, data: value})
            })
            return (
                <View style={{top: 20,height: Dimensions.get('window').height*0.76 - 20, width: Dimensions.get('window').width, backgroundColor: 'transparent'}}>
                    <FlatList
                        data={dataRelation}
                        renderItem={this._renderItemPager.bind(this)}
                        keyExtractor={item => item.data}
                        stickyHeaderIndices = {this.state.stickyHeaderIndices}
                        style={{backgroundColor: 'transparent'}}
                    />
                </View>
            )
        case 1:
            return (
                <View style={{height: Dimensions.get('window').height*0.76 - 20, width: Dimensions.get('window').width, backgroundColor: 'transparent', alignItems: 'center'}}>
                    <View style={{width: '100%', height: '50%', backgroundColor: '#00000060', position: 'absolute', top: 0}}></View>
                    <View style={{width: '100%', height: '50%', position: 'absolute', bottom: 0}}></View>
                    <Image source={{uri:this.props.song.image}} style={{position: 'absolute', width: 260, height: 260, top: 60}}/>
                </View>
            )
        default:
            let {[keyFromAction(API_REQUEST_SONG_LYRIC(this.props.song.songKey))] : lyricKey = {}} = this.props.entities
            let {entities:{lyric:{[lyricKey]: lyricResponse} = {[lyricKey]: {content: '', timedLyric: ''}}}} = this.props
            this.props.loadLyrics(lyricResponse.timedLyric)
            let {entities:{lyricsData:{[lyricResponse.timedLyric]: lyricsDataRes} = {[lyricResponse.timedLyric]: {data: ''}}}} = this.props
            let lyricStr = ''
            if (lyricsDataRes.data.length > 0){
                let result = (new arc4(lyricResponse.keyDecryptLyric)).decodeString(lyricsDataRes.data)
                this.jsonLyrics = this.parseLyrics(result)
                for (object of this.jsonLyrics){
                    if (lyricStr.length > 0){
                        lyricStr = lyricStr + '\n' +object.lyric
                    } else {
                        lyricStr = object.lyric
                    }
                }
            }
            return (
                <View style={{height: Dimensions.get('window').height*0.76 - 20, width: Dimensions.get('window').width, backgroundColor: 'transparent', justifyContent: 'center', flexDirection: 'column'}}>
                    <ScrollView
                        style={{position: 'absolute', width: '100%', height: '100%'}}
                        onScroll = {this.onLyricsScrollEnd.bind(this)}
                        onContentSizeChange={(width, height)=>{
                            this.lyricContentHeight = height
                        }}>
                        <Text style={{top: 32, textAlign: 'center'}}>{
                            lyricStr
                        }</Text>
                    </ScrollView>
                    <PlaylistTouchableBtn
                        size={26}
                        img={'play'}
                        style={{marginLeft: 8, position: 'absolute'}}
                        onClick={()=>{
                            if (this.playPosition < this.jsonLyrics.length){
                                sound.setCurrentTime(this.jsonLyrics[this.playPosition - 1].duration)
                            }
                        }}/>
                </View>
            )
        }
    }

    onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        this.pageIndex = pageNum
        console.log('scrolled to page ', pageNum);
    }

    onLyricsScrollEnd(e){
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        this.playPosition = Math.round((contentOffset.y + viewSize.height/2 - 32)*this.jsonLyrics.length/this.lyricContentHeight)
        console.log('play line: ' + this.playPosition)
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
    }

    convertDuration(string){
        var minute = string.replace('[','').replace(']','').split(':')[0]
        var seconds = string.replace('[','').replace(']','').split(':')[1]
        return minute*60 + parseFloat(seconds)
    }

    getLyricStr(string){
        return string.split(']').pop()
    }

    getDuration(string){
        let durations = []
        var newlines = string.split(']')
        for (i = 0; i < newlines.length - 1; i++){
            durations.push(this.convertDuration(newlines[i]))
        }
        return durations
    }

    // jsonLyric =

    parseLyrics(lyric){
        var lines = lyric.split(/\r\n|\r|\n/)
        let jsonLyrics = []
        for (var line of lines){
            if (line.split('][').length > 1){
                var clones = line.split('][')
                let lyricStr = this.getLyricStr(clones.pop())
                let durations = this.getDuration(line)
                for (duration of durations){
                    jsonLyrics.push({duration: duration, lyric: lyricStr})
                }
            } else {
                var clones = line.split(']')
                let lyricStr = this.getLyricStr(clones.pop())
                let durations = this.getDuration(line)
                for (duration of durations){
                    jsonLyrics.push({duration: duration, lyric: lyricStr})
                }
            }
        }
        return jsonLyrics.sort((a,b)=>{ return parseFloat(a.duration) - parseFloat(b.duration) })
    }

    render() {
        let props = this.props;
        let {pan} = this.state;

        // Calculate the x and y transform from the pan value
        let [translateX, translateY] = [pan.x, pan.y];

        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {transform: [{translateX}, {translateY}]};
        // if (imageSong != null){
        //     let imageSongExpand = imageSong.split('.').pop()
        //     imageSong = imageSong.replace('.'+imageSongExpand, '_500.'+imageSongExpand)
        // }
       if (sound){
           if (this.timer == null){
               // this.addTimer()
               console.log('current time: ' + this.state.currentTime)
           }
       }
       // let date = new Date(null)
       //  date.setSeconds(SECONDS)
        return (
            <Animated.View style={{
                ...imageStyle, overflow: "visible", position: 'absolute', bottom: -Dimensions.get('window').height, width: '100%'
            }} {...this._panResponder.panHandlers} clipsToBounds={false}>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}>
                    <Image source={{uri:this.props.song.image}} style={{height: '100%', aspectRatio: 1}}/>
                    <View style={{flex: 1, left: 0}}>
                        <Text>{props.song.songTitle}</Text>
                        <Text>{props.song.artistName}</Text>
                    </View>
                    <View style={{right: 8, justifyContent: 'center', flexDirection: 'row', }}>
                        {props.isPlaying ? (<PlaylistTouchableBtn size={26} img={'pause'} onClick={()=>this.props.pause()}/>):
                            (<PlaylistTouchableBtn size={26} img={'play'} onClick={()=>this.props.play()}/>)
                        }
                        <PlaylistTouchableBtn size={26} img={'next'} onClick={props.next} style={{left: 8}}/>
                    </View>
                </View>

                <View style={{
                    height: Dimensions.get('window').height,
                    width: '100%',
                    backgroundColor: 'transparent'
                }}>
                    <Image source={{uri:this.props.song.image}} resizeMode={'cover'} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        height: null,
                        width: null,
                    }}
                    />
                    <BlurView viewRef={this.state.viewRef} blurType={'light'} blurAmount={10} style={[{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}]}/>
                    <View style={{height:'76%', width: '100%', backgroundColor: 'transparent', position: 'absolute'}}>
                        <FlatList
                            data={['a','b','c']}
                            pagingEnabled={true}
                            keyExtractor={(item) => item}
                            showsHorizontalScrollIndicator={false}
                            renderItem={this._renderItem.bind(this)}
                            horizontal={true}
                            onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                        />
                    </View>
                    <View style={{position:'absolute', bottom: 0, width: '100%', height: '24%'}}>
                        <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <PlaylistTouchableBtn size={36} img={'like'} style={{width:36, height: 36}}/>
                            <PlaylistTouchableBtn size={36} img={'like'} style={{width:36, height: 36}}/>
                            <PlaylistTouchableBtn size={36} img={'like'} style={{width:36, height: 36}}/>
                            <PlaylistTouchableBtn size={36} img={'like'} style={{width:36, height: 36}}/>
                            <PlaylistTouchableBtn size={36} img={'more'} style={{width:36, height: 36}}/>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
                            <Text style={{color:'white'}}>{this.fancyTime(parseInt(this.state.currentTime))}</Text>
                            <Slider style={{width:'72%'}}
                                    minimumTrackTintColor={'black'}
                                    maximumTrackTintColor={'#666666'}
                                    thumbImage={require('../assets/images/bt_playpage_button_progress_normal.png')}
                                    value={this.state.currentTime/this.props.song.duration}
                                    onValueChange={val => {
                                        if (this.props.song.duration>0){
                                            this.timer = null
                                            sound.setCurrentTime(val*this.props.song.duration)
                                            this.addTimer()
                                        }
                                    }}
                            />
                            <Text style={{color:'white'}}>{this.fancyTime(this.props.song.duration)}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                            <PlaylistTouchableBtn size={46} img={'order'} style={{width:46, height: 46}}/>
                            <PlaylistTouchableBtn size={46} img={'prev'} style={{width:46, height: 46, marginLeft: 8}} onClick={()=>this.props.prev()}/>
                            { props.isPlaying ? (
                                <PlaylistTouchableBtn
                                    size={56}
                                    img={'pause'} style={{width:56, height: 56, marginLeft: 8, marginRight: 8}}
                                    onClick={()=>this.props.pause()}/>
                            ): (
                                <PlaylistTouchableBtn
                                    size={56}
                                    img={'play'} style={{width:56, height: 56, marginLeft: 8, marginRight: 8}}
                                    onClick={()=>{
                                        this.props.loadSong('DR5OA6BswpEk')}}/> // 6DHBZXxtNIKG
                            )}
                            <PlaylistTouchableBtn size={46} img={'next'} style={{width:46, height: 46, marginRight: 8}} onClick={()=>this.props.next()}/>
                            <PlaylistTouchableBtn size={46} img={'list'} style={{width:46, height: 46}}/>
                        </View>
                    </View>
                </View>
            </Animated.View>
        )
    }
    tick() {
        sound.getCurrentTime((seconds)=>{
            this.setState({
                currentTime: seconds
            });
        })
    }

    addTimer(){
        this.timer = setInterval(this.tick.bind(this), 250)
    }
}

export default connect((state, ownProps) => {
    const {player: {isPlaying, nowList, nowAt, collapsed}, entities} = state

    const song = nowList.map((songKey) => entities.songs[songKey])[nowAt] || {
        songTitle: 'Tên',
            songKey: '',
        artistName: 'Artist',
        streamURL: [],
            image: 'https://www.google.com.vn',
            duration: 0
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
                sound.play((msg) => {
                    console.log('time 1: ' + msg)
                })
            })
        }
    }

    if (sound) {
        if (isPlaying) {
            sound.play((msg) => {
                console.log('time 2 abc: ' + msg)
            })
        } else {
            sound.pause()
        }
    }

    return {isPlaying, nowAt, song, collapsed, entities}
}, (dispatch, ownProps) => ({
    play: () => dispatch(PLAYER_PLAY()),
    pause: () => dispatch(PLAYER_PAUSE()),
    next: () => dispatch(PLAYER_NOWLIST_NEXT()),
    prev: () => dispatch(PLAYER_NOWLIST_PREVIOUS()),
    toggleView: () => dispatch(PLAYER_TOGGLE()),
    loadSong: (songId) => {
        dispatch(API_REQUEST_SONG_RELATION(songId));
        dispatch(API_REQUEST_SONG_LYRIC(songId));
        dispatch(API_REQUEST_SONG_GET(songId));
        dispatch(PLAYER_NOWLIST_CLEAR());
        dispatch(PLAYER_NOWLIST_ADD(songId));
        dispatch(PLAYER_PLAY());
    },
    loadLyrics: (lyricsLink) =>{
        dispatch(API_LOAD_LYRICS(lyricsLink));
    }
}))(Player)