import {Component} from 'react'
import {Button, Text, View, Animated} from "react-native";
import * as React from "react";
import Dimensions from "Dimensions"

export class MainTabBar extends Component {
    render() {
        const {navigationState, jumpToIndex, getLastPosition, position, navigation, getLabel} = this.props
        const offset = position.interpolate({
            inputRange: [0, 1, 4],
            outputRange: [Dimensions.get('window').width, 0, 0]
        });

        const {routes, index} = navigationState;
        return (<View style={{position: 'absolute', zIndex: 1000, width: Dimensions.get('window').width, top: 0}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', zIndex: 1001}}>
                <View></View>
                <Text style={{padding: 15, color: index === 0 ? 'red' : 'blue'}}>Của Tui</Text>
                <Text style={{padding: 15, color: index > 0 ? 'red' : 'blue'}}>Online</Text>
                <View></View>
            </View>
            <Animated.View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: offset,
                width: '100%'
            }}>
                <View></View>
                {routes.map((route, i) => {
                    const focused = index === i;
                    const scene = {
                        route,
                        focused,
                        index: i,
                    };
                    return (
                        <Text style={{padding: 15, color: focused ? 'red' : 'blue'}}
                              key={route.key}>{getLabel(scene)}</Text>
                    )
                }).splice(1)}
                <View></View>
            </Animated.View>
        </View>)
    }
}
