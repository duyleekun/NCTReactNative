import React, { Component } from 'react';
import {Button, Text, View} from "react-native";

export default class extends Component {

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>LOL</Text>
                <Button title="Chat with Lucy" onPress={()=> navigate('Detail')}>Nav</Button>
            </View>

        )
    }
}