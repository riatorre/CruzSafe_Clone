/*
 *  WelcomeScreen.js
 * Main welcome screen & login if user is not already authenticated
 */

import React, { Component } from "react";
import {
    Text,
    SafeAreaView,
    Image,
    AsyncStorage,
    TouchableOpacity,
    Linking
} from "react-native";

import { Container, Header, Content, Footer } from "native-base";
import { AuthSession, WebBrowser } from "expo";

import styles from "../components/styles.js";

const authDomain = "https://cruzsafe.appspot.com/login";

function toQueryString(params) {
    return (
        "?" +
        Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&")
    );
}

class WelcomeScreen extends Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* First Screen; Welcome Logo */}
                <Container>
                    <Header style={styles.header} />
                    <Content contentContainerStyle={styles.container}>
                        <Text style={{ fontSize: 36 }}>Welcome to</Text>
                        <Image
                            source={require("../assets/images/CruzSafe.png")}
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={{ fontSize: 36 }}>CruzSafe!</Text>
                        <TouchableOpacity
                            style={styles.signinBtn}
                            onPress={this._handleAuth}
                        >
                            <Text style={{ color: "white", fontSize: 20 }}>
                                Sign In!
                            </Text>
                        </TouchableOpacity>
                    </Content>
                    <Footer style={styles.footer} />
                </Container>
            </SafeAreaView>
        );
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async ID => {
        /*console.log(
            `Attempting to sign in with ${userFirstName} and ${userLastName} and ${userEmail}`
        );*/
        await this.setID(ID);

        //will contain booleans of whether the user wants tips and whether they have viewed certain parts of the app
        var tutorialParams = {
            tips: true,
            reportOnboarding: true,
            thumbnailOnboarding: true,
            historyOnboarding: true,
            sidebarOnboarding: true,
            inHistoryOnboarding: false
        };
        await AsyncStorage.setItem(
            "tutorialParams",
            JSON.stringify(tutorialParams)
        );

        this.props.navigation.navigate("App");
    };

    _handleAuth = async () => {
        let redirectUrl = AuthSession.getRedirectUrl(); //(await Linking.getInitialURL("/")) + "/--/expo-auth-session";

        const queryParams = toQueryString({
            redirect_uri: redirectUrl,
            response_type: "id_token" // id_token will return a JWT token
            //nonce: "REEEEEEE" // ideally, this will be a random value
        });

        const authUrl = `${authDomain}` + queryParams;

        let result = await AuthSession.startAsync({
            authUrl
        }); /**/
        /*
        let result = await WebBrowser.openAuthSessionAsync(
            authUrl,
            (await Linking.getInitialURL("/")) + "/--/expo-auth-session"
        ); /* */
        //console.log(result.params.user);
        const user = JSON.parse(result.params.user);
        //console.log(user);
        await this._signInAsync(JSON.stringify(user));
    };

    async setID(id) {
        try {
            await AsyncStorage.setItem("mobileID", id);
        } catch (error) {
            console.log(error.message);
        }
    }
}
export default WelcomeScreen;
