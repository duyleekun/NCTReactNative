import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';
import {API_REQUEST_PLAYLIST_GET} from "../actions/api";
import PlaylistTouchableBtn from "../components/playListTouchableBtnComponent"

class playlistDetailScreen extends React.Component {
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
            expanded    : false
        };
    }

    toggle(){

    }

    componentDidMount() {
        let props = this.props;
        let {state: {params: {playlistKey}}} = props.navigation;
        props.loadPlaylistDetail(playlistKey)
    }

    render() {
        let {props} = this;
        let {state: {params: {playlistKey}}} = props.navigation;
        let {entities} = props;
        let {playlists: {[playlistKey]: playlistResponse = {}} = {[playlistKey]: {}}} = entities;
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
                        // style={{width: '100%', aspectRatio: 529/257, overflow: 'visible', resizeMode: Image.resizeMode.cover, backgroundColor: 'green'}}/>
                        style={{width: '100%', aspectRatio: 1, resizeMode: 'contain', marginTop: -20}}/>
                    <Text
                        style={{margin: 15, color: 'white'}}
                    >
                        {playlistResponse.description}
                    </Text>
                </View>
                {/*<Text>{JSON.stringify(this.props.navigation.state.params)}</Text>*/}
                {/*<Text>{JSON.stringify(playlistResponse)}</Text>*/}
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1018}}>
                    <View style={{backgroundColor: 'transparent', height: 200, alignItems: 'flex-end', flexDirection: 'row', padding: 15, paddingBottom: 20}}>
                        <View style={{flex: 1}}>
                            <Text style={{color: 'white', fontSize: 20}}
                                  numberOfLines={1}
                                  ellipsizeMode={"tail"}
                            >
                                {playlistResponse.playlistTitle}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingRight: 20}}>
                                <Text style={{color: 'white',fontSize: 18, flex: 1}}
                                      numberOfLines={1}
                                      ellipsizeMode={"tail"}
                                >
                                    {playlistResponse.artistName}
                                </Text>
                                <Image
                                    style={{alignSelf: 'flex-end', width: 18, aspectRatio: 1, marginBottom:3, marginLeft: 10}}
                                    source={require('../assets/images/ic_listen_count.png')}
                                />
                                <Text style={{color: 'white', alignSelf: 'flex-end', fontSize: 17, paddingLeft: 5}}>
                                    {playlistResponse.listened > 1000 ? `${Math.floor(playlistResponse.listened / 100)/10}k`: playlistResponse.listened}
                                </Text>
                            </View>
                        </View>
                        <Image
                            style={{width: Dimensions.get('window').width/7, aspectRatio: 1, padding: 5}}
                            source={require ('../assets/images/ic_btn_online_topic_detail_playall_normal.png')}
                        />
                        <View style={{position: 'absolute', width: '100%',  alignItems: 'center'}}>
                            <View
                                style={{
                                    backgroundColor: 'white', width: Dimensions.get('window').width/8, height: 15 , alignItems: 'center', justifyContent: 'center',
                                    borderTopRightRadius: 5, borderTopLeftRadius: 5
                                }}
                            >
                                <TouchableWithoutFeedback>
                                    <Image
                                        source={this.state.expanded ? this.icons.up : this.icons.down}
                                    />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor: 'white', flex: 1}}>
                        <View style={{margin: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{flex: 1}}>
                                {`${playlistResponse.listSong.length} bài hát`}
                            </Text>
                            <PlaylistTouchableBtn name={'Thêm vào'} img={'fav'} />
                            <PlaylistTouchableBtn name={'Tải về'} img={'download'} />
                            <PlaylistTouchableBtn name={'Chia sẻ'} img={'share'} />
                        </View>

                    </View>
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
            }
        }
    })(playlistDetailScreen);