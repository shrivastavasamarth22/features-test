import {
    Accuracy,
    requestBackgroundPermissionsAsync,
    watchPositionAsync
} from "expo-location";
import {useEffect, useState} from "react";

export default (shouldTrack, callback) => {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        let subscriber;
        if (shouldTrack) {
            (async () => {
                let {status} = await requestBackgroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                subscriber = await watchPositionAsync({
                    accuracy: Accuracy.BestForNavigation,
                    timeInterval: 500,
                    distanceInterval: 5
                }, callback)
            })();
        } else {
            if (subscriber) {
                subscriber.remove();
            }
            subscriber = null;
        }

        return () => {
            if (subscriber) {
                subscriber.remove();
            }
        };

    }, [shouldTrack, callback]);

    return [errorMsg]
}