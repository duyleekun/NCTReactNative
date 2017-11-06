import * as schemas from "../config/apiSchema";
import {normalize, schema} from 'normalizr';

import {API_RESPONSE_ERROR, API_RESPONSE_SUCCESS, isRequest, isDownload} from "../actions/api";

const API_ROOT = 'https://graph.nhaccuatui.com/v4';

export default ({dispatch, getState}) => next => action => {
    const {type, payload} = action;
    if (isRequest(type)) {
        const {method = 'GET', path, query = {}, schemaName} = payload;
        fetch(`${API_ROOT}${path}`, {
            headers: {
                'x-nct-token': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MTA4MjkyNjcsIm5iZiI6MTUwODIzNzI2NywiZGV2aWNlaW5mbyI6IntcIkRldmljZUlEXCI6XCJEMzVFMDIwODhGQ0U0QThFOERDRERCQzlGMDFDQzU2NFwiLFwiT3NOYW1lXCI6XCJpT1NcIixcIk9zVmVyc2lvblwiOlwiMTEuMC4xXCIsXCJBcHBOYW1lXCI6XCJOQ1RWNlwiLFwiQXBwVmVyc2lvblwiOlwiNi4xLjBcIixcIlVzZXJOYW1lXCI6XCJmYi5tdXNpYy4xNTQ3NTU4OTQ4NjM0OTIyXCIsXCJQcm92aWRlclwiOlwiTkNUQ29ycFwiLFwiRGV2aWNlTmFtZVwiOlwiaVBob25lOCwxXCIsXCJRdWFsaXR5UGxheVwiOlwiMTI4XCIsXCJRdWFsaXR5RG93bmxvYWRcIjpcIjEyOFwiLFwiUXVhbGl0eUNsb3VkXCI6XCIxMjhcIixcIk5ldHdvcmtcIjpcIldJRklcIixcIlBob25lTnVtYmVyXCI6XCJcIixcIkxhbmd1YWdlXCI6XCJWTlwifSIsImlhdCI6MTUwODIzNzI2N30.eN6evWadl-XzU7wOwQOlRCrXpBZr8EsxuzsgFcWRWc0',
                'x-nct-deviceid': 'D35E02088FCE4A8E8DCDDBC9F01CC564',
            },
            method: method
        })
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch(API_RESPONSE_SUCCESS({
                    request: payload,
                    response: normalize(responseJson.data, schemas[schemaName])
                }))
            })
            .catch((error) => {
                dispatch(API_RESPONSE_ERROR(error))
            })
    } else  if (isDownload(type)){
        const {method = 'GET', path, query = {}, schemaName} = payload;
        fetch(`${path}`, {
            method: method
        })
            .then((response) => response.text())
            .then((responseBlob) => {
                console.log('response download: ' + responseBlob)
                dispatch(API_RESPONSE_SUCCESS({
                    request: payload,
                    response: normalize({'id': `${path}`, 'data': responseBlob.toString()}, schemas[schemaName])
                }))
            })
            .catch((error) => {
                dispatch(API_RESPONSE_ERROR(error))
            })
    }
    return next(action)
}