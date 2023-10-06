export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const ADD_GEOPOINT = 'ADD_GEOPOINT';
export const ADD_GEOPOINT_TO_POINTS = 'ADD_GEOPOINT_TO_POINTS';


export const startRecording = () => {
    return {
        type: START_RECORDING
    }
}

export const stopRecording = () => {
    return {
        type: STOP_RECORDING
    }
}

export const addGeopoint = (geopoint) => {
    return {
        type: ADD_GEOPOINT,
        geopoint
    }
}

export const addGeopointToPoints = (geopoint) => {
    return {
        type: ADD_GEOPOINT_TO_POINTS,
        geopoint
    }
}