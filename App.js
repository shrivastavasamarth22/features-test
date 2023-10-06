import "react-native-gesture-handler";

import { StyleSheet, Text, View } from "react-native";
import { combineReducers, createStore } from "redux";

import Home from "./screens/Home";
import MapScreen from "./screens/MapScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import locationReducer from "./store/reducer/locationReducer";

const Stack = createStackNavigator();

const rootReducer = combineReducers({
    location: locationReducer,
});

const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="MapScreen" component={MapScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
