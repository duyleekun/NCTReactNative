
import React, { Component } from 'react';

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
// import { apiMiddleware } from 'redux-api-middleware';
import apiMiddleWare from './middleware/api'

import { createStore, applyMiddleware } from 'redux'
// import { } from './actions'
import rootReducer from './reducers'
import {addNavigationHelpers} from "react-navigation";
import {connect, Provider} from "react-redux";
import AppNavigator from "./config/routes";

const store = createStore(
    rootReducer,
    applyMiddleware(
        apiMiddleWare,
        thunkMiddleware, // lets us dispatch() functions
        createLogger(), // neat middleware that logs actions
    )
)

class MyNCT extends Component {
    render() {
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
            })} />
        );
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav
});


const AppWithNavigationState = connect(mapStateToProps)(MyNCT);

export default class extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}