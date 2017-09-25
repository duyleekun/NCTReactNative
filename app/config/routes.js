import {StackNavigator, TabBarTop, TabNavigator} from "react-navigation";
import HelloScreen from "../screens/helloScreen";
import HomeScreen from "../screens/homeScreen";
import SongDetailScreen from "../screens/songDetailScreen";
import PlaylistDetailScreen from "../screens/playlistDetailScreen";
import * as React from "react";
import {MainTabBar} from "../components/mainTabBar";

export default StackNavigator({
    SongDetail: {screen: SongDetailScreen},
    PlaylistDetail: {screen: PlaylistDetailScreen},
    VideoDetail: {screen: HelloScreen},
    MainTabBar: {
        screen: TabNavigator({
            TabItem1: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Của Tui",
                    tabBarGroup: "Của Tui"
                }
            },
            TabItem21: {
                screen: HomeScreen,
                navigationOptions: {
                    tabBarLabel: "Trang Chủ",
                    tabBarGroup: "Online"
                }
            },
            TabItem22: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Playlist",
                    tabBarGroup: "Online"
                }
            },
            TabItem23: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "BXH",
                    tabBarGroup: "Online"
                }
            },
            TabItem24: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Chủ Đề",
                    tabBarGroup: "Online"
                }
            }
        }, {
            tabBarComponent: MainTabBar,
            initialRouteName: 'TabItem21',
            tabBarPosition: 'top',
            swipeEnabled: true,
            animationEnabled: true,
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