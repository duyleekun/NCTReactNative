import React, {Component} from 'react';
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import apiMiddleWare from './middleware/api'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducers'
import {addNavigationHelpers} from "react-navigation";
import {connect, Provider} from "react-redux";
import AppNavigator from "./config/routes";
import Player from "./components/player"
import VideoPlayer from "./components/videoPlayer"
import {StatusBar, View} from "react-native";

const store = createStore(
    rootReducer,
    applyMiddleware(
        apiMiddleWare,
        thunkMiddleware, // lets us dispatch() functions
        createLogger(), // neat middleware that logs actions
    )
)

const AppWithNavigationState = connect(
    (state) => ({
        nav: state.nav
    })
)((props) => (
    <View style={{flex: 1}}>
        <StatusBar
            backgroundColor="transparent"
            barStyle="light-content"
            translucent={true}
        />
        <AppNavigator navigation={addNavigationHelpers({
            dispatch: props.dispatch,
            state: props.nav,
            style: {flex: 1}
        })}/>
        <Player style={{width: '100%'}} />
        <VideoPlayer style={{width: '100%'}} />
    </View>));

export default class extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}