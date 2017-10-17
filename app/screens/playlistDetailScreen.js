import {connect} from "react-redux";
import {FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import {IndicatorViewPager,PagerTitleIndicator} from 'rn-viewpager';

import Dimensions from 'Dimensions';
import {API_REQUEST_PLAYLIST_GET, API_REQUEST_PLAYLIST_RELATION} from "../actions/api";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"
import PlaylistDetailSongList from "../components/playlistDetailSongListComponent"
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
            title       : props.title,
            expanded    : false,
            data : [
                {header: true,  name: 'blank'},
                {header: true,  name: 'intro'},
                {header: false, name: 'detail'}
            ],
            stickyHeaderIndices: [0,0]
        };
    }

    renderItem = ({ item }) => {
        let {props} = this;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
        let {"\"playlistRelation\"" : playlistRelatedResponse = []} = entities;
        if (item.header) {
            if (item.name ==='blank') {
                return (<View style={{height: 100}}/>);
            }else {
                return (
                    <View style={{
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
            return (
                <View style={{backgroundColor: 'white', height: Dimensions.get('window').height -100}}>
                    <View style={{margin: 15, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{flex: 1}}>
                            {`${playlistResponse.listSong.length} bài hát`}
                        </Text>
                        <PlaylistTouchableBtn name={'Thêm vào'} img={'fav'} />
                        <PlaylistTouchableBtn name={'Tải về'} img={'download'} />
                        <PlaylistTouchableBtn name={'Chia sẻ'} img={'share'} />
                    </View>
                    <View style={{flex:1, marginBottom: 50}}>
                        <IndicatorViewPager
                            style={{flex:1, paddingTop:20, backgroundColor:'white'}}
                            indicator={this._renderTitleIndicator()}
                        >
                            <View style={{paddingTop: 20}}>
                                <PlaylistDetailSongList
                                    data={playlistResponse.listSong.map(songKey => entities.songs[songKey])}
                                    onClick={this.props.playSelectedSong}
                                />
                            </View>
                            <View style={{paddingTop: 20}}>
                                <PlaylistDetailRelatedList
                                    data={playlistRelatedResponse.map(playListKey => entities.playlists[playListKey])}
                                    onClick={()=>{}}
                                />
                            </View>
                        </IndicatorViewPager>
                    </View>
                </View>
            )
        }
    };

    _renderTitleIndicator() {
        return <PagerTitleIndicator
            titles={['Bài hát', 'Liên quan']}
            style= {{
                height: 50,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#eaeaea'
            }}
            selectedBorderStyle={{backgroundColor: '#32AAEA'}}
            selectedItemTextStyle={{color: '#32AAEA'}} />;
    }

    componentDidMount() {
        let props = this.props;
        let {state: {params: {playlistKey}}} = props.navigation;
        props.loadPlaylistDetail(playlistKey);
        props.loadPlaylistRelation(playlistKey)
    }

    render() {
        let {props} = this;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
        let {"\"playlistRelation\"" : playlistRelatedResponse = []} = entities;
        let img = playlistResponse.playlistImage;
        let position = img.length - 4;

        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }
        return(
            <View style={{position: 'relative', height: '100%'}}>
                <View style={{position: 'relative'}}>
                    <Image
                        source={{uri: [img.slice(0, position), '_500', img.slice(position)].join('') }}
                        style={{width: '100%', aspectRatio: 1, resizeMode: 'contain', marginTop: -20}}/>
                    <Text
                        style={{margin: 15, color: 'white'}}
                    >
                        {playlistResponse.description}
                    </Text>
                </View>
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1018}}>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.name}
                        stickyHeaderIndices={this.state.stickyHeaderIndices}
                    />
                </View>
            </View>
        )
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