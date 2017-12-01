/**
 * Created by nguyenphuc on 11/30/17.
 */

import {connect} from 'react-redux'
import {Animated, View} from 'react-native'
import * as React from 'react'

class FadeInView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            fadeAnim: new Animated.Value( props.fadeAnim.hide ? 0: 1),
        }
    }
    componentDidMount(){
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: this.props.fadeAnim.hide ? 1: 0,
                duration: 1200
            }
        ).start()
    }
    render(){
        let {fadeAnim} = this.state
        return(
            <Animated.View style={{...this.props.style, opacity: fadeAnim}}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default connect((state, ownProps)=>{
    return {}
}, (dispatch, ownProps)=>({

}))(FadeInView)