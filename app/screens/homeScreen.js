import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';
import {API_REQUEST_HOME_QUERY} from "../actions/api";
import Feature from "../components/featureComponent"

import {
    SECTION_HEADER_ALBUM, SECTION_HEADER_TODAY, SECTION_HEADER_TOPIC, SECTION_HEADER_RANKING, SECTION_HEADER_SONG,
    SECTION_HEADER_VIDEO, SECTION_HEADER_FUNNY
} from "../config/constants"
import SectionHeader from "../components/sectionHeaderComponent"
import HotTopic from "../components/hotTopicComponent"
import HomeRanking from "../components/homeRankingComponent"
import HomeRankingMV from "../components/homeRankingMVComponent"
import SongHot from "../components/songHotComponent"
import HomeAlbum from "../components/homeAlbumComponent"
import HomeVideo from "../components/homeVideoComponent"

class HomeScreen extends React.Component {
    static navigationOptions = ({navigationOptions}) => ({
        title: 'Home'
    });

    componentDidMount() {
        let props = this.props;
        props.loadHomePage()
    }

    render() {
        let {entities, marginTop} = this.props;
        let {entities: {home: {0: homeResponse} = {0: {Showcase: [], TopicHot: [], BXH: [], SongHot: [], BXHVideo: [], AlbumHot: [], PlayListByTime: [], VideoHot: [], Relax: []}}}} = this.props;
        return (<ScrollView style={{backgroundColor: "white", marginTop}}>
            <FlatList
                data={homeResponse.Showcase}
                keyExtractor={(item) => item.itemId}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback onPress={()=> this.props.gotoShowCaseItem(item)}>
                        <View style={{width: Dimensions.get('window').width, aspectRatio: 619 / 250}}>
                            <Image source={{uri: item.image}} style={{width: '100%', height: '100%'}}/>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                horizontal={true}
            />
            <View style={{margin: 15, paddingBottom: 10}}>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <Feature
                        onClick={this.props.gotoFeatureItem}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Album Hot"} icon={SECTION_HEADER_ALBUM}/>
                    <HomeAlbum
                        data={homeResponse.AlbumHot.map(playlistKey => entities.playlists[playlistKey]).slice(0,6)}
                        onClick={this.props.gotoPlayList}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Nghe gì hôm nay"} icon={SECTION_HEADER_TODAY}/>
                    <HomeAlbum
                        data={homeResponse.PlayListByTime.map(playlistKey => entities.playlists[playlistKey]).slice(0,3)}
                        onClick={this.props.gotoPlayList}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Chủ Đề"} icon={SECTION_HEADER_TOPIC}/>
                    <HotTopic
                        data={homeResponse.TopicHot.map(topicId => entities.topics[topicId])}
                        onClick={this.props.gotoTopic}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA", position: 'relative'}}>
                    <SectionHeader title={"BXH Bài Hát Việt Nam"} icon={SECTION_HEADER_RANKING}/>
                    <HomeRanking
                        data={
                            entities.rankingMusics === undefined ?
                                [] :
                                entities.rankingMusics[homeResponse.BXH].items.map(item => entities.rankingItems[item])}
                        onClick={this.props.playSelectedList}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Bài Hát Hot"} icon={SECTION_HEADER_SONG}/>
                    <SongHot
                        data={homeResponse.SongHot.map(songKey => entities.songs[songKey]).slice(0,5)}
                        onClick={this.props.playSelectedSong}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Bài Hát Hot"} icon={SECTION_HEADER_SONG}/>
                    <HomeRankingMV
                        data={
                            entities.rankingVideos === undefined ?
                                [] :
                                entities.rankingVideos[homeResponse.BXHVideo].items.map(item => entities.rankingItems[item])}
                        onClick={this.props.playSelectedMV}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"MV Hot"} icon={SECTION_HEADER_VIDEO}/>
                    <HomeVideo
                        data={homeResponse.VideoHot.map(videoKey => entities.videos[videoKey]).slice(0,4)}
                        onClick={this.props.playSelectedMV}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Clip Vui & Hài Kịch"} icon={SECTION_HEADER_FUNNY}/>
                    <HomeVideo
                        data={homeResponse.Relax.map(videoKey => entities.videos[videoKey]).slice(0,4)}
                        onClick={this.props.playSelectedMV}
                    />
                </View>
            </View>
        </ScrollView>)
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
            loadHomePage: () => {
                dispatch(API_REQUEST_HOME_QUERY())
            },
            gotoShowCaseItem: (item) => {
                let {navigate} = ownProps.navigation;
                console.log(item.type);
                switch (item.type) {
                    case 'Video':
                        // navigate('VideoDetail',{id: item.itemId, title: item.title})
                        break;
                    case 'List':
                        navigate('PlaylistDetail',{id: item.itemId, title: item.title});
                        break;
                    case 'Song':
                        navigate('SongDetail',{id: item.itemId, title: item.title});
                        break;
                    default:
                }
            },
            gotoFeatureItem: (route) =>{
                console.log(route);
                let {navigate} = ownProps.navigation;
                navigate(route)
            },
            gotoPlayList: (playlistKey) =>{
                ownProps.navigation.navigate('PlaylistDetail',{playlistKey})
            },
            gotoTopic: (topicId) =>{
                ownProps.navigation.navigate('TopicDetail',{topicId})
            },
            playSelectedList: (playlistKey) =>{
                // ownProps.navigation.navigate('SongDetail',{playlistKey})
                ownProps.navigation.navigate('MockScreen',{playlistKey})
            },
            playSelectedSong: (songKey) =>{
                ownProps.navigation.navigate('MockScreen',{songKey})
            },
            playSelectedMV: (videoKey)=>{
                ownProps.navigation.navigate('MockScreen',{videoKey})
            }
        }
    })(HomeScreen);