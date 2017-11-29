/**
 * Created by nguyenphuc on 11/29/17.
 */
import {connect} from "react-redux";
import {Button, FlatList, Image, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import * as React from "react";

import Dimensions from 'Dimensions';

class ShareScreen extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            currentTime: 0,
        };
    }
    render(){
        return(
            <View style={{backgroundColor: 'transparent', width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                <View style={{backgroundColor: '#00000060', position: 'absolute', width: '100%', height: '100%'}}></View>
                <View style={{backgroundColor: 'transparent', position: 'absolute', width: '100%', height: '100%'}}>
                    <View style={{flex: 1}}/>
                    <View style={{width: '100%', height: '20%', backgroundColor: 'green', bottom: 0}}>
                    </View>
                </View>
            </View>
        )
    }

}

export default connect(
    (state, ownProps)=>{
        return {}
    }, (dispatch, ownProps)=>({

    }))(ShareScreen)