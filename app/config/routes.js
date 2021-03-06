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
            ["ME/HOME"]: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Của Tui",
                }
            },
            ["ONLINE/HOME"]: {
                screen: HomeScreen,
                navigationOptions: {
                    tabBarLabel: "Trang Chủ",
                }
            },
            ["ONLINE/PLAYLIST"]: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Playlist",
                }
            },
            ["ONLINE/BXH"]: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "BXH",
                }
            },
            ["ONLINE/TOPIC"]: {
                screen: HelloScreen,
                navigationOptions: {
                    tabBarLabel: "Chủ Đề",
                }
            }
        }, {
            tabBarComponent: MainTabBar,
            initialRouteName: "ONLINE/HOME",
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