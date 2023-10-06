export class Point {
    constructor(c, identifier) {
        this.latitude = c.latitude;
        this.longitude = c.longitude;
        this.identifier = identifier;
    }

    get x() {
        return this.latitude;
    }

    set x(value) {
        this.latitude = value;
    }

    get y() {
        return this.longitude;
    }

    set y(value) {
        this.longitude = value;
    }
}

export const initialRegion = {
    latitude: 23.188670,
    longitude: 77.446871,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
}

const MARKER1 = {
    latitude: 23.188862,
    longitude: 77.447398,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
}

const MARKER2 = {
    latitude: 23.188912,
    longitude: 77.447607,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
}

const MARKER3 = {
    latitude: 23.189035,
    longitude: 77.447899,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
}

const POINT1 = new Point(MARKER1, 'marker1')
const POINT2 = new Point(MARKER2, 'marker2')
const POINT3 = new Point(MARKER3, 'marker3')

export const POINTS = [POINT1, POINT2, POINT3]