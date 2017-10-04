import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';
import {API_REQUEST_HOME_QUERY} from "../actions/api";
import Feature from "../components/featureComponent"

import {SECTION_HEADER_ALBUM,SECTION_HEADER_TODAY,SECTION_HEADER_TOPIC,SECTION_HEADER_RANKING,SECTION_HEADER_SONG,SECTION_HEADER_VIDEO} from "../config/constants"
import SectionHeader from "../components/sectionHeaderComponent"
import HotTopic from "../components/hotTopicComponent"
import HomeRanking from "../components/homeRankingComponent"
import HomeRankingMV from "../components/homeRankingMVComponent"
import SongHot from "../components/songHotComponent"


class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };

    componentDidMount() {
        let props = this.props;
        props.loadHomePage()
    }

    render() {
        let {entities} = this.props;
        let {entities: {home: {0: homeResponse} = {0: {Showcase: [],TopicHot: [],BXH: [],SongHot: [],BXHVideo: []}}}} = this.props;
        return (<ScrollView style={{backgroundColor: "white"}}>
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
                    <Feature onClick={(route) => this.props.gotoFeatureItem(route)} />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Chủ Đề"} icon={SECTION_HEADER_TOPIC}/>
                    <HotTopic
                        data={homeResponse.TopicHot.map((id) => entities.topics[id])}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA", position: 'relative'}}>
                    <SectionHeader title={"BXH Bài Hát Việt Nam"} icon={SECTION_HEADER_RANKING}/>
                    <HomeRanking
                        data={
                            entities.rankingMusics === undefined ?
                                [] :
                                entities.rankingMusics[homeResponse.BXH].items.map(item => entities.rankingItems[item])}
                    />
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Bài Hát Hot"} icon={SECTION_HEADER_SONG}/>
                    <SongHot
                        data={homeResponse.SongHot.map(songKey => entities.songs[songKey]).slice(0,5)}/>
                </View>
                <View style={{paddingBottom: 15,marginBottom: 20, borderBottomWidth: 1, borderColor: "#EAEAEA"}}>
                    <SectionHeader title={"Bài Hát Hot"} icon={SECTION_HEADER_SONG}/>
                    <HomeRankingMV
                        data={
                            entities.rankingVideos === undefined ?
                                [] :
                                entities.rankingVideos[homeResponse.BXHVideo].items.map(item => entities.rankingItems[item])}/>
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
            }
        }
    })(HomeScreen);