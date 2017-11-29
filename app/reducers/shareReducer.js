/**
 * Created by nguyenphuc on 11/29/17.
 */
import {handleActions} from 'redux-actions'
import {SHARE_TOGGLE} from '../actions/share'
import Immutable from 'seamless-immutable'

let initialState = Immutable({show: false});

export default handleActions({
    [SHARE_TOGGLE]: (state, action) => state.set('show', (now)=>!now),
}, initialState)