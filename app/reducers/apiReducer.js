import Immutable from 'seamless-immutable'
import {isResponse, isResponseOk} from "../actions/api";

export default (state, action) => {
    const {type} = action;
    if (isResponse(type)) {
        if (isResponseOk(type)) {
            //TODO: merge to state
            return state.merge(action.payload.response.entities,{deep: true})
        }
    }
    return state || Immutable({})
}