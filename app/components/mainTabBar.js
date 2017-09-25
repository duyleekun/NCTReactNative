import {Component} from 'react'
import {Button, Text, View} from "react-native";
import * as React from "react";

export class MainTabBar extends Component {
    render() {
        const {navigationState, jumpToIndex, getLastPosition, position, navigation, getLabel} = this.props
        const {routes, index} = navigationState;
        return (<View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 15}}>
                <View></View>
                <Text style={{color: index === 0 ? 'red' : 'blue'}}>Của Tui</Text>
                <Text style={{color: index > 0 ? 'red' : 'blue'}}>Online</Text>
                <View></View>
            </View>
            <View style={{
                flexDirection: 'row',
                marginBottom: 15,
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                display: index === 0 ? 'none' : 'flex'
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
                        <Text style={{padding: 10, color: focused ? 'red' : 'blue'}}
                              key={route.key}>{getLabel(scene)}</Text>
                    )
                }).splice(1)}
                <View></View>
            </View>
        </View>)
    }
}
