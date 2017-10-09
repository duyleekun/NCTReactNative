import {Component} from 'react'
import {Button, Text, View, Animated, Image, Platform} from "react-native";
import * as React from "react";
import Dimensions from "Dimensions"

const firstRowHeight = 45;
const secondRowHeight = 40;

export const statusHeight = (Platform.OS === 'ios') ? 20 : 0

export const singleHeight = statusHeight + firstRowHeight
export const doubleHeight = singleHeight + secondRowHeight

export class MainTabBar extends Component {
    render() {
        const {navigationState, jumpToIndex, getLastPosition, position, navigation, getLabel} = this.props
        const {width: windowWidth} = Dimensions.get('window')
        const offset = position.interpolate({
            inputRange: [0, 1],
            outputRange: [-secondRowHeight, 0],
            extrapolate: 'clamp',
            useNativeDriver: true

        });

        const heightAnim = position.interpolate({
            inputRange: [0, 1],
            outputRange: [singleHeight, doubleHeight],
            extrapolate: 'clamp',
            useNativeDriver: true

        });

        const opacity = position.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
            useNativeDriver: true

        });

        const leftIndicatorOffset = position.interpolate({
            inputRange: [0, 1, 4],
            outputRange: [0, 0, windowWidth / 4 * 3],
            extrapolate: 'clamp',
            useNativeDriver: true

        });

        const {routes, index} = navigationState;
        return (
            <Animated.View style={{height: heightAnim}}>
                <View style={{
                    position: 'absolute',
                    width: windowWidth,
                    top: 0,
                    left: 0,
                    backgroundColor: 'transparent',
                    aspectRatio: 1
                }}>
                    <Image source={require("../assets/images/theme_default.gif")} style={{
                        width: windowWidth,
                        aspectRatio: 1,
                        height: 'auto',
                        resizeMode: 'contain',
                        position: 'absolute',
                    }}/>
                    <View style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', width: windowWidth,
                        aspectRatio: 1,
                    }}/>
                </View>

                <View style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: windowWidth,
                    top: statusHeight,
                    left: 0,
                    backgroundColor: 'transparent',
                }}>

                    <View style={{
                        flexDirection: 'row',
                        height: firstRowHeight,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingLeft: 25,
                        paddingRight: 25,
                    }}>
                        {['Của Tui', 'Online'].map((currentTitle, i) => {
                            const focused = index === i;

                            const opacityAnim = position.interpolate({
                                inputRange: [0,1],
                                outputRange: i === 0 ? [1, 0.85] : [0.85, 1],
                                extrapolate: 'clamp',
                                useNativeDriver: true

                            });
                            return (
                                <View style={{flex: 1}}>
                                    <Animated.Text key={routes[i].key} style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        opacity: opacityAnim,
                                    }}
                                                   onPress={() => navigation.navigate(routes[i].key)}>{currentTitle}</Animated.Text>
                                </View>)
                        })}
                    </View>
                    <Animated.View style={{
                        opacity: opacity,
                        marginTop: offset,
                        width: '100%',
                        height: secondRowHeight,
                        backgroundColor: 'white',

                    }}>
                        <View style={{
                            width: '100%',
                            height: secondRowHeight,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            {routes.map((route, i) => {
                                const focused = index === i;

                                const activeColor = focused ?
                                    position.interpolate({
                                        inputRange: [i - 1, i, i + 1],
                                        outputRange: ['black', '#279FEB', 'black'],
                                        extrapolate: 'clamp',
                                        useNativeDriver: true

                                    }) :
                                    position.interpolate({
                                        inputRange: [i - 1, i, i + 1],
                                        outputRange: ['black', (i - 1 == index || i + 1 == index) ? '#279FEB' : 'black', 'black'],
                                        extrapolate: 'clamp',
                                        useNativeDriver: true

                                    });
                                const scene = {
                                    route,
                                    focused,
                                    index: i,
                                };
                                return (
                                    <View style={{flex: 1}}>
                                        <Animated.Text style={{
                                            color: activeColor,
                                            textAlign: 'center',
                                        }}
                                                       onPress={() => navigation.navigate(route.key)}
                                                       key={route.key}>{getLabel(scene)}</Animated.Text>
                                    </View>
                                )
                            }).splice(1)}
                        </View>
                        <Animated.View style={{
                            width: windowWidth / 4,
                            height: 3,
                            backgroundColor: '#36AAEB',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            marginLeft: leftIndicatorOffset
                        }}></Animated.View>
                    </Animated.View>
                </View>
            </Animated.View>
        )
    }
}
