import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import * as React from "react";
import actions from "../actions"
import Dimensions from 'Dimensions';

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    }

    componentDidMount() {
        let props = this.props
        props.loadHomePage()
    }

    render() {
        let {entities: {home: {0: homeResponse} = {0: {Showcase: []}}}} = this.props
        return (<View>
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
            <Text>{JSON.stringify(homeResponse.Showcase)}</Text>
        </View>)
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
                dispatch(actions.api.request.home.query())
            },
            gotoShowCaseItem: (item) => {
                let {navigate} = ownProps.navigation
                switch (item.type) {
                    case 'Video':
                        // navigate('VideoDetail',{id: item.itemId, title: item.title})
                        break;
                    case 'List':
                        navigate('PlaylistDetail',{id: item.itemId, title: item.title})
                        break;
                    case 'Song':
                        // navigate('SongDetail',{id: item.itemId, title: item.title})
                        break;
                    default:
                }
            }
        }
    })(HomeScreen);