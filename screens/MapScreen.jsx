import {
    Accuracy,
    requestBackgroundPermissionsAsync,
    watchPositionAsync,
} from "expo-location";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import MapView, {
    Circle,
    Marker,
    PROVIDER_GOOGLE,
    Polygon,
    Polyline,
} from "react-native-maps";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import { calculateConvexHull } from "../sortPoints";
import customMapStyles from "../customMapStyles";
import { haversine } from "haversine-distance";
import { useIsFocused } from "@react-navigation/native";

const MapScreen = () => {
    const initialRegion = {
        latitude: 23.18867,
        longitude: 77.446871,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    };

    const currentLocation = useSelector(
        (state) => state.location.currentLocation
    );
    const recording = useSelector((state) => state.location.recording);
    const points = useSelector((state) => state.location.poinst);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const callBackFunction = (loc) => {
        if (recording && haversine(loc.coords, shopRegion) <= 2250) {
            dispatch(locationActions.addGeopointToPoints(loc));
        } else {
            dispatch(locationActions.addGeopoint(loc));
        }
    };

    const startLocationTracking = async () => {
        let { status } = await requestBackgroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        const subscriber = await watchPositionAsync(
            {
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 500,
                distanceInterval: 5,
            },
            callBackFunction
        );

        return subscriber;
    };

    const stopLocationTracking = (subscriber) => {
        if (subscriber) {
            subscriber.remove();
        }
    };

    
    const [subscriber, setSubscriber] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    
    useEffect(() => {
        if (isFocused || recording) {
            startLocationTracking().then((newSubscriber) => {
                setSubscriber(newSubscriber);
            });
        } else {
            stopLocationTracking(subscriber);
        }

        return () => {
            stopLocationTracking(subscriber);
        };
    }, [isFocused, recording]);

    

    if (currentLocation) {
        console.log(currentLocation.coords);
        const onPress = () => {
            if (haversine(currentLocation, initialRegion) <= 10 && recording) {
                dispatch(locationActions.stopRecording());
            } else if (
                !recording &&
                haversine(currentLocation, initialRegion) <= 10
            ) {
                dispatch(locationActions.startRecording());
            } else if (
                haversine(currentLocation, initialRegion) > 10 &&
                recording
            ) {
                console.log("Return to the shop to stop recording");
            } else {
                console.log("Not in the shop");
            }
        };

        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initRegion}
                    style={styles.mapStyle}
                    customMapStyle={customMapStyles}
                >
                    <Circle
                        center={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude,
                        }}
                        radius={1500}
                        strokeWidth={3}
                        strokeColor="#FFC117"
                        fillColor={"rgba(255, 157, 0, 0.1)"}
                    />
                    <Marker
                        coordinate={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude,
                        }}
                    />
                    <Marker coordinate={currentLocation.coords} />
                    {recording ? (
                        <Polyline
                            coordinates={points.map((point) => point.coords)}
                            strokeWidth={3}
                            strokeColor={COLORS.mainLavender}
                        />
                    ) : null}
                    {!recording && points.length ? (
                        <Polygon
                            coordinates={calculateConvexHull(
                                points.map((point) => point.coords)
                            )}
                            strokeWidth={3}
                            strokeColor="#510a8c"
                            fillColor={"rgba(81, 10, 140, 0.3)"}
                        />
                    ) : null}
                </MapView>
                <Button
                    title={recording ? "Stop recording" : "Start recording"}
                    onPress={onPress}
                    style={styles.buttonStyle}
                />
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : (
                <ActivityIndicator size={48} color="#56B532" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover",
        backgroundColor: "#fff",
    },
    mapStyle: {
        width: "100%",
        height: "100%",
    },
    buttonStyle: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        width: "95%",
    },
});

export default MapScreen;
