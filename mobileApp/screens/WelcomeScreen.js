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
                            source={require("../assets/images/SCPD_Logo.png")}
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

    /*
     * Used to handle the logging in; takes in an email and attempts to find a user
     * in the database.
     *
     * Takes in the firstName, lastName, and email.
     * (Note that this is temporary; once login is implemeneted with Shibboleth, these three variables will be given to us and will call the APIs automatically)
     */
    async handleLogin(firstName, lastName, email) {
        // Main Portion of the request, contains all metadata to be sent to link
        await fetch("https://cruzsafe.appspot.com/api/users/newID", {
            // Defines what type of call is being made; above link is a POST request, so POST is needed Below
            method: "POST",
            // Metadata in regards as to what is expected to be sent/recieved
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
            body: JSON.stringify({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim()
            })
        })
            .then(response => response.json())
            .then(async json => {
                await this.setID(JSON.stringify(json.insertId));
            })
            // Unsuccessful Call to API
            .catch(err => {
                console.log(err);
            });
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async (userFirstName, userLastName, userEmail) => {
        console.log(
            `Attempting to sign in with ${userFirstName} and ${userLastName} and ${userEmail}`
        );
        await this.handleLogin(userFirstName, userLastName, userEmail);

        //will contain booleans of whether the user wants tips and whether they have viewed certain parts of the app
        var tutorialParams = {
            tips: false,
            reportOnboarding: true,
            historyOnboarding: true,
            sidebarOnboarding: true
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
        await this._signInAsync(user.firstName, user.lastName, user.email);
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
