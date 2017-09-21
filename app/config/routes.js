import {DrawerNavigator, StackNavigator, TabBarTop, TabNavigator} from "react-navigation";
import HelloScreen from "../screens/helloScreen";
import {Text, View} from "react-native";
import * as React from "react";
import {MainTabBar} from "../components/mainTabBar";

const stackNav = StackNavigator({
    Home: {screen: HelloScreen},
    Detail: {screen: HelloScreen},
    Playlist: {screen: HelloScreen},
}, {
    headerMode: 'none'
})

const AppNavigator = TabNavigator({
    TabItem1: {
        screen: stackNav,
        navigationOptions: {
            tabBarLabel: "Của Tui",
            // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
        }
    },
    TabItem2: {
        screen: TabNavigator({
            TabItem21: {
                screen: stackNav,
                navigationOptions: {
                    tabBarLabel: "Trang Chủ",
                    // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
                }
            },
            TabItem22: {
                screen: stackNav,
                navigationOptions: {
                    tabBarLabel: "Playlist",
                    // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
                }
            },
            TabItem23: {
                screen: stackNav,
                navigationOptions: {
                    tabBarLabel: "BXH",
                    // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
                }
            },
            TabItem24: {
                screen: stackNav,
                navigationOptions: {
                    tabBarLabel: "Chủ Đề",
                    // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
                }
            }
        }, {
            tabBarOptions: {
                activeTintColor: '#222'
            },
            swipeEnabled: true,
            tabBarPosition: 'top',
            tabBarComponent: TabBarTop,
        }),
        navigationOptions: {
            tabBarLabel: "Online",
            // tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
        }
    }
}, {
    tabBarComponent: MainTabBar,
    tabBarOptions: {
        activeTintColor: '#222',
        labelStyle: {
            fontSize: 12,
        },
        style: {
            backgroundColor: 'blue',
            justifyContent: 'center'
        },
        tabStyle: {
            backgroundColor: 'red',
            flex: 0,
            alignSelf: 'center'
        }
    },
    tabBarPosition: 'top',
    swipeEnabled: true
})

export default AppNavigator