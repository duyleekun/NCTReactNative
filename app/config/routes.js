import {StackNavigator, TabBarTop, TabNavigator} from "react-navigation";
import HelloScreen from "../screens/helloScreen";
import HomeScreen from "../screens/homeScreen";
import SongDetailScreen from "../screens/songDetailScreen";
import PlaylistDetailScreen from "../screens/playlistDetailScreen";
import * as React from "react";
import {MainTabBar} from "../components/mainTabBar";

export default StackNavigator({
    SongDetail: { screen: SongDetailScreen},
    PlaylistDetail: { screen: PlaylistDetailScreen},
    VideoDetail: { screen: HelloScreen},
    MainTabBar: {
        screen: TabNavigator({
            TabItem1: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Của Tui",
                }
            },
            TabItem2: {
                screen: TabNavigator({
                    TabItem21: {
                        screen: HomeScreen,
                        navigationOptions: {
                            tabBarLabel: "Trang Chủ",
                        }
                    },
                    TabItem22: {
                        screen: HelloScreen,
                        navigationOptions: {
                            tabBarLabel: "Playlist",
                        }
                    },
                    TabItem23: {
                        screen: HelloScreen,
                        navigationOptions: {
                            tabBarLabel: "BXH",
                        }
                    },
                    TabItem24: {
                        screen: HelloScreen,
                        navigationOptions: {
                            tabBarLabel: "Chủ Đề",
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
            initialRouteName: 'TabItem2',
            tabBarPosition: 'top',
            swipeEnabled: true
        }),
        navigationOptions: {
            header: null
        }
    }
}, {
    // headerMode: () => {
    //     debugger
    //     return 'none'
    // },
    initialRouteName: 'MainTabBar'
})