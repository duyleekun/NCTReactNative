import Immutable from 'seamless-immutable'
import {isResponse, isResponseOk} from "../actions/api";

export default (state, action) => {
    const {type} = action;
    let newState = state
    if (isResponse(type)) {
        if (isResponseOk(type)) {
            newState = newState.merge(action.payload.response.entities,{deep: true});
            newState = newState["\"playlistRelation\""] !== undefined ? [] : newState;
            // newState = newState["\"songRelation\""] !== undefined ? [] : newState;
            newState = newState.merge({[JSON.stringify(action.payload.request.schemaName)]: action.payload.response.result})
        }
    }
    return newState || Immutable({})
}