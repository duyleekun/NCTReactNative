/**
 * Created by nguyenphuc on 11/29/17.
 */
import {handleActions} from 'redux-actions'
import {SHARE_TOGGLE, SHARE_SHOW} from '../actions/share'
import Immutable from 'seamless-immutable'

let initialState = Immutable({showAnim: false});

export default handleActions({
    [SHARE_TOGGLE]: (state, action) => state.set('showAnim', (now)=>!now),
    [SHARE_SHOW]: (state, action) => state.set('showAnim', action.payload),
}, initialState)