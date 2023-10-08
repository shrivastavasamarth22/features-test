import React, { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView, {
    Circle,
    Marker,
    PROVIDER_GOOGLE,
    Polygon,
    Polyline,
} from "react-native-maps";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Point } from "../models/Point";
import { calculateConvexHull } from "../sortPoints";
import { haversine } from "haversine-distance";
import { useIsFocused } from "@react-navigation/native";
import { useLocation } from "../hooks/useLocation";

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

    const callback = useCallback(
        (location) => callBackFunction(location),
        [recording]
    );

    const [err] = useLocation(isFocused || recording, callback);

    const customMapStyle = [
        {
            elementType: "geometry",
            stylers: [
                {
                    color: "#212121",
                },
            ],
        },
        {
            elementType: "labels.icon",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#757575",
                },
            ],
        },
        {
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#212121",
                },
            ],
        },
        {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [
                {
                    color: "#757575",
                },
            ],
        },
        {
            featureType: "administrative.country",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#9e9e9e",
                },
            ],
        },
        {
            featureType: "administrative.land_parcel",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#bdbdbd",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#757575",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
                {
                    color: "#181818",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#616161",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#1b1b1b",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#2c2c2c",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#8a8a8a",
                },
            ],
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
                {
                    color: "#373737",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
                {
                    color: "#3c3c3c",
                },
            ],
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [
                {
                    color: "#4e4e4e",
                },
            ],
        },
        {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#616161",
                },
            ],
        },
        {
            featureType: "transit",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#757575",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [
                {
                    color: "#000000",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#3d3d3d",
                },
            ],
        },
    ];

    if (currentLocation) {
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
                    customMapStyle={customMapStyle}
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
            <ActivityIndicator size={48} color="#56B532" />
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
