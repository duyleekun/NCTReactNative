import * as schemas from "../config/apiSchema";
import {normalize, schema} from 'normalizr';
import actions from '../actions'
import {isRequest} from "../actions/api";

const API_ROOT = 'https://graph.nhaccuatui.com/v4';

export default ({dispatch, getState}) => next => action => {
    const {type, payload} = action;
    if (isRequest(type)) {
        const {method = 'GET', path, query = {}, schemaName} = payload;
        fetch(`${API_ROOT}${path}`, {
            headers: {
                'x-nct-token': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDg0MDAzOTgsIm5iZiI6MTUwNTgwODM5OCwiZGV2aWNlaW5mbyI6IntcIkRldmljZUlEXCI6XCI5RkNGOTM5MkY5NkU0NEEyODY5OEEwMTIwQjQzRjk2RVwiLFwiT3NOYW1lXCI6XCJpT1NcIixcIk9zVmVyc2lvblwiOlwiMTEuMFwiLFwiQXBwTmFtZVwiOlwiTkNUVjZcIixcIkFwcFZlcnNpb25cIjpcIjYuMC41XCIsXCJVc2VyTmFtZVwiOlwiXCIsXCJQcm92aWRlclwiOlwiTkNUQ29ycFwiLFwiRGV2aWNlTmFtZVwiOlwiaVBob25lIDZcIixcIlF1YWxpdHlQbGF5XCI6XCIxMjhcIixcIlF1YWxpdHlEb3dubG9hZFwiOlwiMTI4XCIsXCJRdWFsaXR5Q2xvdWRcIjpcIjEyOFwiLFwiTmV0d29ya1wiOlwiV0lGSVwiLFwiTGFuZ3VhZ2VcIjpcIlZOXCJ9IiwiaWF0IjoxNTA1ODA4Mzk4fQ.l5-Mo3mGtn26jUNZgLEP8kx4T8MUP5vpCb6cCFSKSLI',
                'x-nct-deviceid': '9FCF9392F96E44A28698A0120B43F96E'
            },
            method: method
        })
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch(actions.api.response.success({
                    request: payload,
                    response: normalize(responseJson.data, schemas[schemaName])
                }))
            })
            .catch((error) => {
                dispatch(actions.api.response.error(error))
            })
    }
    return next(action)
}