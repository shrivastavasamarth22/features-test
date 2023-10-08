import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE, Polygon, Polyline} from "react-native-maps";
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {Point} from "../models/Point";
import { calculateConvexHull } from "../sortPoints"
import {useIsFocused} from "@react-navigation/native";

const MapScreen = () => {
    const initialRegion = {
        latitude: 23.188670,
        longitude: 77.446871,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
    }

    const [state, setState] = useState({points: [POINT1, POINT2, POINT3]});


    return (
        <View style={styles.container}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default MapScreen;