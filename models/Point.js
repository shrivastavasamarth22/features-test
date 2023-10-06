export class Point {
    constructor(c) {
        this.latitude = c.latitude;
        this.longitude = c.longitude;
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
