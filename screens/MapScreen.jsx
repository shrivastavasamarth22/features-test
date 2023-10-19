import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import  MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const MapScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus === 'granted') {
                let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                if (backgroundStatus === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    setLocation(location);
                } else {
                    setErrorMsg('Background location access not granted');
                }
            } else {
                setErrorMsg('Permission to access foreground location was denied');
            }

        })();
    }, [])
}

