import {StackNavigator, TabBarTop, TabNavigator} from "react-navigation";
import HelloScreen from "../screens/helloScreen";
import HomeScreen from "../screens/homeScreen";
import SongDetailScreen from "../screens/songDetailScreen";
import PlaylistScreen from "../screens/playlistScreen";
import * as React from "react";
import {doubleHeight, MainTabBar, singleHeight} from "../components/mainTabBar";

const componentWithPaddingAdded = (component : React.Component,marginTop) => (props) => {
    //FUN FACT, *C* const name must be UpperCased
    // https://stackoverflow.com/a/33471928/861451
    const C = component
    return (<C {...props} {...{}}  />)
}

export default StackNavigator({
    ArtistListDetail: {screen: HelloScreen},
    PlaylistScreen: {screen: PlaylistScreen},
    SongDetail: {screen: SongDetailScreen},
    SongListDetail: {screen: HelloScreen},
    Top100Detail: {screen: HelloScreen},
    TopicDetail: {screen: HelloScreen},
    VideoDetail: {screen: HelloScreen},
    VideoListDetail: {screen: HelloScreen},
    MockScreen: {screen: HelloScreen},
    MainTabBar: {
        screen: TabNavigator({
            ["ME/HOME"]: {
                screen: componentWithPaddingAdded(HelloScreen, singleHeight),
                navigationOptions: {
                    tabBarLabel: "Của Tui",
                }
            },
            ["ONLINE/HOME"]: {
                // screen: HomeScreen,
                screen: componentWithPaddingAdded(HomeScreen, doubleHeight),
                navigationOptions: {
                    tabBarLabel: "Trang Chủ",
                }
            },
            ["ONLINE/PLAYLIST"]: {
                screen: componentWithPaddingAdded(PlaylistScreen, doubleHeight),
                navigationOptions: {
                    tabBarLabel: "Playlist",
                }
            },
            ["ONLINE/BXH"]: {
                screen: componentWithPaddingAdded(HelloScreen, doubleHeight),
                navigationOptions: {
                    tabBarLabel: "BXH",
                }
            },
            ["ONLINE/TOPIC"]: {
                screen: componentWithPaddingAdded(HelloScreen, doubleHeight),
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