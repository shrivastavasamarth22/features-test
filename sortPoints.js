/*
 * @param {Object} cpt a point to be measured from the baseline
 * @param {Array} bl the baseline, as represented by a two-element
 *   array of latlng objects.
 * @returns {Number} an approximate distance measure
 */

const getDistance = (cpt, bl) => {
    const vY = bl[1].latitude - bl[0].latitude,
        vX = bl[0].longitude - bl[1].longitude
    return (vX * (cpt.latitude - bl[0].latitude) + vY * (cpt.longitude - bl[0].longitude))
}

/*
 * @param {Array} baseLine a two-element array of lat-lng objects
 *   representing the baseline to project from
 * @param {Array} latLngs an array of latlng objects
 * @returns {Object} the maximum point and all new points to stay
 *   in consideration for the hull.
 */

const findMostDistantPointFromBaseLine = (baseLine, latLngs) => {
    let maxD = 0,
        maxPt = null,
        newPoints = [],
        i, pt, d;

    for (i = latLngs.length - 1; i >= 0; i--) {
        pt = latLngs[i]
        d = getDistance(pt, baseLine)

        if (d > 0) {
            newPoints.push(pt)
        } else {
            continue
        }

        if (d > maxD) {
            maxD = d;
            maxPt = pt
        }
    }

    return {
        maxPoint: maxPt,
        newPoints
    }
}

/*
 * Given a baseline, compute the convex hull of latLngs as an array
 * of latLngs.
 *
 * @param {Array} latLngs
 * @returns {Array}
 */

const buildConvexHull = (baseLine, latLngs) => {
    let convexHullBaseLines = [],
        t = findMostDistantPointFromBaseLine(baseLine, latLngs)

    if (t.maxPoint) { // If there is still a point "outside" the baseline
        convexHullBaseLines =
            convexHullBaseLines.concat(
                buildConvexHull([baseLine[0], t.maxPoint], t.newPoints)
            )
        convexHullBaseLines =
            convexHullBaseLines.concat(
                buildConvexHull([t.maxPoint, baseLine[1]], t.newPoints)
            )
        return convexHullBaseLines
    } else { // if there is no more point "outside" the baseline, the current baseline is part of the convex hull
        return [baseLine[0]]
    }
}

/*
 * Given an array of latlngs, compute a convex hull as an array
 * of latlngs
 *
 * @param {Array} latLngs -> { latitude: XXXX, longitude: XXXX }
 * @returns {Array}
 */

module.exports = function calculateConvexHull(latLngs) {
    // find first baseline
    let maxLat = false,
        minLat = false,
        maxLng = false,
        minLng = false,
        maxLatPt = null,
        minLatPt = null,
        maxLngPt = null,
        minLngPt = null,
        maxPt = null,
        minPt = null,
        i

    for (i = latLngs.length - 1; i >= 0; i--) {
        let pt = latLngs[i]
        if (maxLat === false || pt.latitude > maxLat) {
            maxLatPt = pt
            maxLat = pt.latitude
        }
        if (minLat === false || pt.latitude < minLat) {
            minLatPt = pt
            minLat = pt.latitude
        }
        if (maxLng === false || pt.longitude > maxLng) {
            maxLngPt = pt
            maxLng = pt.longitude
        }
        if (minLng === false || pt.longitude < minLng) {
            minLngPt = pt
            minLng = pt.longitude
        }
    }

    if (minLat !== maxLat) {
        minPt = minLatPt
        maxPt = maxLatPt
    } else {
        minPt = minLngPt
        maxPt = maxLngPt
    }

    return [].concat(buildConvexHull([minPt, maxPt], latLngs),
        buildConvexHull([maxPt, minPt], latLngs))
}
