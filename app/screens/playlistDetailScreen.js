import {connect} from "react-redux";
import {FlatList, Image, Text, TouchableWithoutFeedback, View, Animated} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';
import {API_REQUEST_PLAYLIST_GET, API_REQUEST_PLAYLIST_RELATION} from "../actions/api";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import PlaylistDetailSongItem from "../components/playlistDetailSongItemComponent"
import PlaylistDetailRelatedItem from "../components/playlistDetailRelatedItemComponent"
import {displayListenTime} from "../config/utils"
import {keyFromAction} from "../lib/action_utilities";
import {PLAYER_NOWLIST_ADD, PLAYER_TOGGLE} from "../actions/player";
const fakeViewHeight = 100;
const playerHeight = 50;
class PlaylistDetailScreen extends React.Component {
    static navigationOptions = ({navigationOptions}) => ({
        title: 'playListDetailScreen', header: null
    });
    hHeight = 0;
    dHeight = 0;
    btnBarHeight = 0;
    detailBarHeight = 0;

    headerHeight= (event) => {
        let {x, y, width, height} = event.nativeEvent.layout;
        console.log('header x='+x+',y='+y+',w='+width+',h='+height);
        // console.log(Dimensions.get('window').height);
        this.hHeight= height;
    };
    itemHeight= (event) => {
        let {x, y, width, height} = event.nativeEvent.layout;
        console.log('item x='+x+',y='+y+',w='+width+',h='+height);
        // console.log(Dimensions.get('window').height);
        this.setState({iHeight: height});// force render to adjust fake height when item height is calculated
    };
    getBtnBarHeight= (event) => {
        this.btnBarHeight = event.nativeEvent.layout.height;
        console.log(this.btnBarHeight)
    };
    getDetailBarHeight=(event) => {
        this.detailBarHeight = event.nativeEvent.layout.height;
        console.log(this.detailBarHeight)
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            position: new Animated.Value(0),
            expanded: false,
            expandAnim: new Animated.Value(),
            iHeight: 0,
            detailOpacity: new Animated.Value(1)
        };
    }

    componentWillMount() {
        let props = this.props;
        let {state: {params: {playlistKey}}} = props.navigation;
        props.loadPlaylistDetail(playlistKey);
        props.loadPlaylistRelation(playlistKey)
    }
    renderItem = ({item, index}) => {
        let {props,dHeight,hHeight} = this;
        let {position,detailOpacity} = this.state;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;

        let {[keyFromAction(API_REQUEST_PLAYLIST_RELATION(playlistKey))]: playlistRelatedResponse = []} = entities;
        const songList = (playlistResponse.listSong || []).map(songKey => entities.songs[songKey]);
        const relatedList = (playlistRelatedResponse || []).map(playListKey => entities.playlists[playListKey]);
        let number = this.state.index === 0 ? songList.length : relatedList.length;

        if (item.blank === true) {
            if (item.height !==0)
                return (<Animated.View style={{minHeight: item.height ,height: this.state.expandAnim, backgroundColor: item.backgroundColor}}/>);
            else {
                if (dHeight === 0)
                    dHeight= Dimensions.get('window').height;
                this.state.fakeHeight=  dHeight - hHeight - number * this.state.iHeight - playerHeight;
                // if (this.state.iHeight!==0)
                //     debugger
                console.log("D="+dHeight+",H="+hHeight+",I="+this.state.iHeight+",F="+this.state.fakeHeight);
                return (<View style={{height: this.state.fakeHeight, backgroundColor: 'white'}}/>)
            }
        }

        if (item.header === true) {
            const icons = {
                'up': require('../assets/images/ic_expand_up.png'),
                'down': require('../assets/images/ic_expand_down.png')
            };
            const {width: windowWidth} = Dimensions.get('window');
            const leftIndicatorOffset = this.state.position.interpolate({
                inputRange: [0, 1],
                outputRange: [0, windowWidth / 2],
                extrapolate: 'clamp',
                useNativeDriver: true
            });
            const opacity = detailOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
                useNativeDriver: true

            });

            return (
                <View onLayout={this.headerHeight}>
                    <View
                        onLayout={this.getDetailBarHeight}
                        style={{
                            backgroundColor: 'transparent',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            padding: 15,
                            paddingTop: 0,
                            paddingBottom: 20
                        }}>
                        <Animated.View style={{flex: 1,opacity: opacity}}>
                            <Text style={{color: 'white', fontSize: 20}}
                                  numberOfLines={1}
                                  ellipsizeMode={"tail"}>
                                {playlistResponse.playlistTitle}
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingRight: 20}}>
                                <Text style={{color: 'white', fontSize: 18}}
                                      numberOfLines={1}
                                      ellipsizeMode={"tail"}>
                                    {playlistResponse.artistName}
                                </Text>
                                <Image
                                    style={{
                                        alignSelf: 'flex-end',
                                        width: 18,
                                        aspectRatio: 1,
                                        marginBottom: 3,
                                        marginLeft: 10
                                    }}
                                    source={require('../assets/images/ic_listen_count.png')}
                                />
                                <Text style={{color: 'white', alignSelf: 'flex-end', fontSize: 17, paddingLeft: 5}}>
                                    {displayListenTime(playlistResponse.listened)}
                                </Text>
                            </View>
                        </Animated.View>
                        <Animated.Image
                            style={{width: Dimensions.get('window').width / 7, aspectRatio: 1, padding: 5,opacity: opacity}}
                            source={require('../assets/images/ic_btn_online_topic_detail_playall_normal.png')}
                        />
                        <View style={{position: 'absolute', alignItems: 'center', right: 0, left: 0, bottom: 0}}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    width: Dimensions.get('window').width / 8,
                                    height: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopRightRadius: 5,
                                    borderTopLeftRadius: 5
                                }}>
                                <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
                                    <Image
                                        source={this.state.expanded ? icons.up : icons.down}/>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor: 'white'}}>
                        <View onLayout={this.getBtnBarHeight}
                            style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{flex: 1}}>
                                {`${playlistResponse.listSong.length} bài hát`}
                            </Text>
                            <PlaylistTouchableBtn name={'Thêm vào'} img={'fav'}/>
                            <PlaylistTouchableBtn name={'Tải về'} img={'download'}/>
                            <PlaylistTouchableBtn name={'Chia sẻ'} img={'share'}/>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderColor: '#eaeaea',
                            alignItems: 'center'
                        }}>
                            {['Bài hát', 'Liên quan'].map((currentTitle, i) => {

                                const activeColor =
                                    position.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: i === 0 ? ['#36AAEB', 'black'] : ['black', '#36AAEB'],
                                        extrapolate: 'clamp',
                                        useNativeDriver: true
                                    });

                                return (
                                    <Animated.Text key={currentTitle} style={{
                                        textAlign: 'center',
                                        height: 50,
                                        lineHeight: 30,
                                        flex: 1,
                                        justifyContent: 'center',
                                        color: activeColor
                                    }} onPress={() => this.changeTab(i)}>
                                        {currentTitle}
                                    </Animated.Text>
                                )
                            })}
                            <Animated.View style={{
                                width: windowWidth / 2,
                                height: 3,
                                backgroundColor: '#36AAEB',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                marginLeft: leftIndicatorOffset
                            }}/>
                        </View>
                    </View>
                </View>
            )
        }
        if (this.state.index === 0) {
            return (
                <PlaylistDetailSongItem data={item} idx={index} onClick={this.props.playSelectedSong} onLayout={this.itemHeight}/>
            )
        } else {
            return (
                <PlaylistDetailRelatedItem data={item} idx={index} onLayout={this.itemHeight}/>
            )
        }
    };

    render() {
        let {props} = this;

        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;


        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
        let {[keyFromAction(API_REQUEST_PLAYLIST_RELATION(playlistKey))]: playlistRelatedResponse = []} = entities;

        let img = playlistResponse.playlistImage;
        const songList = (playlistResponse.listSong || []).map(songKey => entities.songs[songKey]);
        const relatedList = (playlistRelatedResponse || []).map(playListKey => entities.playlists[playListKey]);
        const data = this.state.index === 0 ? songList : relatedList;

        return (
            <View style={{position: 'relative', height: '100%'}}>
                <View style={{position: 'relative'}}>
                    <Image
                        source={{uri: img.replace(".jpg", "_500.jpg")}}
                        style={{width: '100%', aspectRatio: 1, resizeMode: 'contain', marginTop: -20}}/>
                    <Text
                        style={{margin: 15, color: 'white'}}>
                        {playlistResponse.description}
                    </Text>
                </View>
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1018}}>
                    <FlatList
                        style={{flex: 1, marginBottom: playerHeight}}
                        data={[{blank: true, height: fakeViewHeight, backgroundColor: 'transparent'},{header: true}, ...data, {blank: true, height: 0}]}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={(item, index) => this.keyExtraction(item,index)}
                        stickyHeaderIndices={[1]}
                        extraData={data}
                        scrollEnable={!this.state.expanded}
                    />
                    <View style={{position: 'absolute',width: '100%', top: 20, left: 0, right: 0, backgroundColor: '#00ffffaa', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                        <TouchableWithoutFeedback
                            onPress={this.props.goBack}>
                            <Image
                                source={require('../assets/images/ic_btn_return_nor.png')}
                                style={{width: 20, height: 20}}/>
                        </TouchableWithoutFeedback>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{ color: 'white', fontSize: 22, flex: 1, textAlign: 'center'}} >
                            {playlistResponse.playlistTitle}
                        </Text>
                        <View style={{width: 30, height: 30}}/>
                    </View>
                </View>
            </View>
        )
    }

    changeTab(idx: number) {
        if (this.state.index !== idx) {
            Animated.timing(
                this.state.position,
                {
                    toValue: idx,
                    duration: 200,
                    delay: 50
                }
            ).start()
        }
        this.setState({
            index: idx
        });
    }

    keyExtraction(item, index) {
        if (index < 2)
            return index;
        if (item.songKey !== undefined)
            return item.songKey;
        if (item.playlistKey !== undefined)
            return item.playlistKey;
        return index;
    }
    toggle(){
        console.log('btn click');
        let initialValue    = this.state.expanded? Dimensions.get('window').height-playerHeight-this.btnBarHeight-this.detailBarHeight : fakeViewHeight,
            finalValue      = this.state.expanded? fakeViewHeight : Dimensions.get('window').height-playerHeight-this.btnBarHeight-this.detailBarHeight;
        this.state.expandAnim.setValue(initialValue);
        Animated.spring(
            this.state.expandAnim,
            {
                toValue: finalValue,
                bounciness: 0,
                speed:11,
                delay: this.state.expanded ? 200:0,
            }
        ).start();
        Animated.timing(
            this.state.detailOpacity,
            {
                toValue: this.state.expanded ? 1:0 ,
                duration: 200,
                delay: this.state.expanded ? 0:250
            }
        ).start();
        this.setState({
            expanded : !this.state.expanded
        });
    }
}

export default connect(
    (state, ownProps) => {
        return {
            navigate: ownProps.navigation.navigate,
            entities: state.entities
        }
    },
    (dispatch, ownProps) => {
        return {
            loadPlaylistDetail: (playlistKey) => {
                dispatch(API_REQUEST_PLAYLIST_GET(playlistKey))
            },
            loadPlaylistRelation: (playlistKey) => {
                dispatch(API_REQUEST_PLAYLIST_RELATION(playlistKey))
            },
            playSelectedSong: (songKey) => {
                dispatch(PLAYER_NOWLIST_ADD(songKey));
                dispatch(PLAYER_TOGGLE());
            },
            goBack: () =>{
                console.log('pressed back');
                ownProps.navigation.goBack(null);
            }
        }
    })(PlaylistDetailScreen);