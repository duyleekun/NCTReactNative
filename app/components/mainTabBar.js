import {Component} from 'react'
import {Button, Text, View} from "react-native";
import * as React from "react";

export class MainTabBar extends Component {
    render() {
        const {navigationState, jumpToIndex, getLastPosition, position, navigation, getLabel} = this.props
        const {routes, index} = navigationState;
        return (<View style={{flexDirection: 'row',marginTop: 15, justifyContent: 'space-between', backgroundColor: 'transparent'}}>
            <View></View>
            {routes.map((route, i) => {
                const focused = index === i;
                const scene = {
                    route,
                    focused,
                    index: i,
                };
                return (
                    <Text style={{padding: 10, color: focused ? 'red' : 'blue'}} key={route.key}>{getLabel(scene)}</Text>
                )
            })}
            <View></View>
        </View>)
    }
}
