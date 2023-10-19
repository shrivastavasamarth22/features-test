import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import  MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native"

import customMapStyles  from '../customMapStyles'

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

    if (location) {
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialCamera={location}
                style={styles.mapStyle}
                customMapStyle={customMapStyles}
            >
                <Marker
                    coordinate={location}
                    title="My Location"
                    description="I am here"
                />
            </MapView>
        </View>
    } else {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
            }}>
                <Text>
                    {errorMsg}
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover",
        backgroundColor: "#fff",
    },
    mapStyle: {
        width: "100%",
        height: "100%",
    }
})
