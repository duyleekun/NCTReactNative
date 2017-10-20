import Immutable from 'seamless-immutable'
import {isResponse, isResponseOk} from "../actions/api";

export default (state, action) => {
    const {type} = action;
    let newState = state
    if (isResponse(type)) {
        if (isResponseOk(type)) {
            newState = newState.merge(action.payload.response.entities,{deep: true});
            newState = newState.merge({[btoa(JSON.stringify(action.payload.request))]: action.payload.response.result})
            //btoa: string to base64
            //atob: base64 to string
        }
    }
    return newState || Immutable({})
}