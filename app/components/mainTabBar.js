import {Component} from 'react'
import {Button, Text, View, Animated, Image} from "react-native";
import * as React from "react";
import Dimensions from "Dimensions"
import {doubleHeight, singleHeight} from "../screens/playlistDetailScreen";


export class MainTabBar extends Component {
    render() {
        const {navigationState, jumpToIndex, getLastPosition, position, navigation, getLabel} = this.props
        const {width: windowWidth} = Dimensions.get('window')
        const offset = position.interpolate({
            inputRange: [0, 1],
            outputRange: [windowWidth, 0],
            extrapolate: 'clamp',
            useNativeDriver: true

        });
        const {routes, index} = navigationState;
        return (<View style={{
            position: 'absolute',
            // zIndex: 1,
            width: windowWidth,
            top: 0,
            left: 0,
            backgroundColor: 'transparent',
            aspectRatio: 1
        }}>
            <Image source={require("../assets/images/theme_default.gif")} style={{width: windowWidth, aspectRatio: 1, height: 'auto', resizeMode: 'contain', backgroundColor: 'red', position: 'absolute'}}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',height: singleHeight}}>
                <View></View>
                <Text style={{padding: 15, color: index === 0 ? 'red' : 'blue'}}
                      onPress={() => navigation.navigate(routes[0].key)}>Của Tui</Text>
                <Text style={{padding: 15, color: index > 0 ? 'red' : 'blue'}}
                      onPress={() => navigation.navigate(routes[1].key)}>Online</Text>
                <View></View>
            </View>
            <Animated.View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: offset,
                width: '100%',
                backgroundColor: 'green',
                height: doubleHeight - singleHeight
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
                              onPress={() => navigation.navigate(route.key)}
                              key={route.key}>{getLabel(scene)}</Text>
                    )
                }).splice(1)}
                <View></View>
            </Animated.View>
        </View>)
    }
}
