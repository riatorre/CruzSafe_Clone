import React from "react";
import { ActivityIndicator, AsyncStorage, View } from "react-native";

import styles from "../components/styles.js";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // This is where the app determines if authentication is needed
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem("mobileID");
        this.props.navigation.navigate(userToken ? "App" : "Auth");
    };

    /* Screen will render a loading circle if
    determining need for authentication is taking an abnormal amount of time*/
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }
}
