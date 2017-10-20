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

class PlaylistDetailScreen extends React.Component {
    static navigationOptions = ({navigationOptions}) => ({
        title: 'playListDetailScreen', header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            position: new Animated.Value(0),
            expanded: false
        };
    }

    componentWillMount() {
        let props = this.props;
        let {state: {params: {playlistKey}}} = props.navigation;
        props.loadPlaylistDetail(playlistKey);
        props.loadPlaylistRelation(playlistKey)
    }

    renderItem = ({item, idx}) => {
        let {props} = this;
        let {position, index} = this.state;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;

        let {[keyFromAction(API_REQUEST_PLAYLIST_RELATION(playlistKey))]: playlistRelatedResponse = []} = entities;
        if (item.blank === true) {
            return (<View style={{height: item.height, backgroundColor: item.backgroundColor}}/>);
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
            return (
                <View>
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            padding: 15,
                            paddingBottom: 20
                        }}>
                        <View style={{flex: 1}}>
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
                        </View>
                        <Image
                            style={{width: Dimensions.get('window').width / 7, aspectRatio: 1, padding: 5}}
                            source={require('../assets/images/ic_btn_online_topic_detail_playall_normal.png')}
                        />
                        <View style={{position: 'absolute', alignItems: 'center', right: 0, left: 0}}>
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
                                <TouchableWithoutFeedback>
                                    <Image
                                        source={this.state.expanded ? icons.up : icons.down}/>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor: 'white'}}>
                        <View style={{margin: 15, flexDirection: 'row', alignItems: 'center'}}>
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
                <PlaylistDetailSongItem data={item} key={idx}/>
            )
        } else {
            return (
                <PlaylistDetailRelatedItem data={item} key={idx}/>
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
                    {/*TODO add fake view to cover the rest of the screen if there are not enough items on screen*/}
                    {/*Use window height and other items' height*/}
                    <FlatList
                        style={{flex: 1, marginBottom: 50}}
                        data={[{blank: true, height: 100, backgroundColor: 'transparent'},{header: true}, ...data, {blank: true, height: 9000,backgroundColor: 'white'}]}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => this.keyExtraction(item,index)}
                        stickyHeaderIndices={[1]}
                        extraData={data}
                        initialNumToRender={5}
                    />
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
                ownProps.navigation.navigate('MockScreen', {songKey})
            }
        }
    })(PlaylistDetailScreen);