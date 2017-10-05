import {connect} from "react-redux";
import {Button, Text, View} from "react-native";
import * as React from "react";

class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        let {state: {params: {title} = {title: (new Date()).toISOString()}}} = navigation
        return {
            title
        }
    }

    render() {
        let props = this.props;
        return (<View>
            <Text>Home</Text>
            <Text>{JSON.stringify(props.navigation.state.params)}</Text>
            <Button title="Nest Navigate" onPress={() => props.navigate('PlaylistDetail')}/>
            <Button title="Test" onPress={() => props.loadHomePage()}/>
        </View>)
    }
}

export default connect(
    (state, ownProps) => {
        return {
            navigate: ownProps.navigation.navigate
        }
    },
    (dispatch, ownProps) => {
        return {
            loadHomePage: () => {
                dispatch(API_REQUEST_HOME_QUERY())
            }
        }
    })(HomeScreen);