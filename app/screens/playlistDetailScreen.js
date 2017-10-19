import {connect} from "react-redux";
import {FlatList, Image, Text, TouchableWithoutFeedback, View, Animated} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';
import {API_REQUEST_PLAYLIST_GET, API_REQUEST_PLAYLIST_RELATION} from "../actions/api";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import PlaylistDetailSongItem from "../components/playlistDetailSongItemComponent"
import PlaylistDetailRelatedList from "../components/playlistDetailRelatedListComponent"
import {displayListenTime} from "../config/utils"

class PlaylistDetailScreen extends React.Component {
    static navigationOptions = ({navigationOptions}) => ({
        title: 'playListDetailScreen', header: null
    });

    constructor(props){
        super(props);

        this.icons = {
            'up'    : require('../assets/images/ic_expand_up.png'),
            'down'  : require('../assets/images/ic_expand_down.png')
        };

        this.state = {
            index       : 0,
            position    : new Animated.Value(0),
            title       : props.title,
            expanded    : false,
            headers : [
                {header: true,  name: 'blank'},
                {header: true,  name: 'intro'},
                {header: false, name: 'detail'}
            ],
            songList: [],
            relatedList: [],
            showingList: [],
            stickyHeaderIndices: [0,0]
        };
    }

    componentDidMount() {
        let props = this.props;
        let {state: {params: {playlistKey}}} = props.navigation;
        props.loadPlaylistDetail(playlistKey);
        props.loadPlaylistRelation(playlistKey)
    }

    renderItem = ({ item , idx}) => {
        let {props} = this;
        let {position,index} = this.state;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
        let {"\"playlistRelation\"" : playlistRelatedResponse = []} = entities;
        if (item.header) {
            if (item.name ==='blank') {
                return (<View key={"blank"} style={{height: 100}}/>);
            }else {
                return (
                    <View key={"intro"}
                        style={{
                        backgroundColor: 'transparent',
                        alignItems: 'flex-end',
                        flexDirection: 'row',
                        padding: 15,
                        paddingBottom: 20}}>
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
                        <View style={{position: 'absolute', width: '100%', alignItems: 'center'}}>
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
                                        source={this.state.expanded ? this.icons.up : this.icons.down}/>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                )
            }
        }else{
            if (item.name === 'detail') {
                const {width: windowWidth} = Dimensions.get('window');
                const leftIndicatorOffset = position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, windowWidth / 2],
                    extrapolate: 'clamp',
                    useNativeDriver: true
                });
                return (
                    <View key={"detail"} style={{backgroundColor: 'white'}}>
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
                )
            }
            else{
                return(
                    <PlaylistDetailSongItem data={item} key={idx}/>
                )
            }
            //TODO add fake view to cover the rest of the screen if there are not enough items on screen
            //Use window height and other items' height
        }
    };

    componentWillMount(){
        this.state.showingList = this.state.headers.concat(this.state.songList)
    }

    render() {
        let {props} = this;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
        let {"\"playlistRelation\"" : playlistRelatedResponse = []} = entities;
        let img = playlistResponse.playlistImage;
        let position = img.length - 4;
        this.state.songList = playlistResponse.listSong.map(songKey => entities.songs[songKey]);
        this.state.relatedList = playlistRelatedResponse.map(playListKey => entities.playlists[playListKey]);

        console.log(this.state.showingList);
        // this.state.showingList = this.state.headers.concat(this.state.songList);
        // console.log(this.state.showingList);
        // this.setState({
        //     songList: playlistResponse.listSong.map(songKey => entities.songs[songKey]),
        //     relatedList: playlistRelatedResponse.map(playListKey => entities.playlists[playListKey]),
        //     showingList: this.state.headers.concat( this.state.idx === 0 ? this.state.songList : this.state.relatedList)
        //     });

        return(
            <View style={{position: 'relative', height: '100%'}}>
                <View style={{position: 'relative'}}>
                    <Image
                        source={{uri: [img.slice(0, position), '_500', img.slice(position)].join('') }}
                        style={{width: '100%', aspectRatio: 1, resizeMode: 'contain', marginTop: -20}}/>
                    <Text
                        style={{margin: 15, color: 'white'}}>
                        {playlistResponse.description}
                    </Text>
                </View>
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1018}}>
                    <FlatList
                        style={{flex: 1, marginBottom: 50}}
                        data={this.state.showingList}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.name}
                        stickyHeaderIndices={this.state.stickyHeaderIndices}/>
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
                    duration: 300,
                    userNativeDiver: true
                }
            ).start(this.updateState(idx))
        }
    }

    updateState(idx) {
        this.setState({
            index: idx,
            showingList: this.state.headers.concat( idx === 0 ? this.state.songList: this.state.relatedList)
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
            playSelectedSong: (songKey) =>{
                ownProps.navigation.navigate('MockScreen',{songKey})
            }
        }
    })(PlaylistDetailScreen);