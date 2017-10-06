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
            outputRange: [windowWidth, 0],
            extrapolate: 'clamp',
            useNativeDriver: true

        });
        const {routes, index} = navigationState;
        return (
            <View>
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
                    zIndex: 1,
                    width: windowWidth,
                    top: 0,
                    left: 0,
                    backgroundColor: 'transparent',
                    aspectRatio: 1
                }}>

                    <View style={{
                        flexDirection: 'row',
                        height: firstRowHeight,
                        position: 'absolute',
                        top: statusHeight,
                        width: '100%',
                        paddingLeft: 25,
                        paddingRight: 25,
                    }}>
                        {['Của Tui', 'Online'].map((currentTitle, currentId) => (
                            <Text style={{
                                flex: 1,
                                height: '100%',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                color: 'white',
                                opacity: index === currentId ? 1 : 0.8,
                            }}
                                  onPress={() => navigation.navigate(routes[currentId].key)}>{currentTitle}</Text>))}
                    </View>
                    <Animated.View style={{
                        flexDirection: 'row',
                        marginLeft: offset,
                        width: '100%',
                        position: 'absolute',
                        top: singleHeight,
                        height: secondRowHeight,
                        backgroundColor: 'white',
                    }}>
                        {routes.map((route, i) => {
                            const focused = index === i;
                            const scene = {
                                route,
                                focused,
                                index: i,
                            };
                            return (
                                <Text style={{
                                    color: focused ? '#279FEB' : 'black',
                                    flex: 1,
                                    height: '100%',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}
                                      onPress={() => navigation.navigate(route.key)}
                                      key={route.key}>{getLabel(scene)}</Text>
                            )
                        }).splice(1)}
                    </Animated.View>
                </View>
            </View>
        )
    }
}
