/*
 *  WelcomeScreen.js
 * Main welcome screen & login if user is not already authenticated
 */

import React, { Component } from "react";
import {
    Text,
    SafeAreaView,
    Image,
    TextInput,
    AsyncStorage,
    TouchableOpacity
} from "react-native";

import { Container, Header, Content, Footer } from "native-base";
import Swiper from "react-native-swiper";
import styles from "../components/styles.js";

class WelcomeScreen extends Component {
    // State of the screen; maintained as long as app is not fully closed.
    state = { mobileID: 1, username: "", errorMessage: null };

    render() {
        const isDisabled = this.state.username.length === 0;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Swiper
                    showsButtons={true}
                    loop={false}
                    showsPagination={false}
                >
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
                        </Content>
                        <Footer style={styles.footer} />
                    </Container>

                    {/* Second Screen; Login */}
                    <Container>
                        <Header style={styles.header} />
                        <Content contentContainerStyle={styles.container}>
                            <Text style={{ fontSize: 24 }}>
                                Please enter a name
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholder="Name"
                                onChangeText={username =>
                                    this.setState({ username })
                                }
                                value={this.state.username}
                            />
                            <TouchableOpacity
                                style={
                                    !this.state.username
                                        ? styles.btn_disabled
                                        : styles.btn
                                }
                                disabled={isDisabled}
                                onPress={this._signInAsync}
                            >
                                <Text style={{ color: "white" }}>Sign in!</Text>
                            </TouchableOpacity>
                        </Content>
                        <Footer style={styles.footer} />
                    </Container>
                </Swiper>
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
        var response = await fetch(
            "https://cruzsafe.appspot.com/api/users/checkID",
            {
                // Defines what type of call is being made; above link is a POST request, so POST is needed Below
                method: "POST",
                // Metadata in regards as to what is expected to be sent/recieved
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                })
            }
        );
        /*
            // Successful Call to API
            .then(() => {
                return true;
            })
            // Unsuccessful Call to API
            .catch(err => {
                console.log(err);
                return false;
            });
            */
        var json = await response.json();
        this.state.mobileID = json;
        console.log(json);
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async () => {
        this.handleLogin();
        await AsyncStorage.setItem("userToken", this.state.username);
        this.props.navigation.navigate("App");
    };
}
export default WelcomeScreen;
