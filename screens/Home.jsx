import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('MapScreen')}
            >
                <Text style={styles.text}>
                    Map Test
                </Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    text: {
        fontSize: 20,
        color: '#0A84FF'
    }
})

export default Home;
