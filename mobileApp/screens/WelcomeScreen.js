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
    state = {
        mobileID: 1,
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        errorMessage: null
    };

    render() {
        //const isDisabled = this.state.username.length === 0;
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
                                UCSC CruzSafe: Credentials
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="words"
                                placeholder="First Name"
                                onChangeText={userFirstName =>
                                    this.setState({ userFirstName })
                                }
                                value={this.state.userFirstName}
                            />
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="words"
                                placeholder="Last Name"
                                onChangeText={userLastName =>
                                    this.setState({ userLastName })
                                }
                                value={this.state.userLastName}
                            />
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholder="Email"
                                onChangeText={userEmail =>
                                    this.setState({ userEmail })
                                }
                                value={this.state.userEmail}
                            />
                            <TouchableOpacity
                                style={
                                    !this.state.userEmail |
                                    !this.state.userFirstName |
                                    !this.state.userLastName
                                        ? styles.btn_disabled
                                        : styles.btn
                                }
                                //disabled={isDisabled}
                                onPress={this._signInAsync} // Initiate sign in Async!
                            >
                                <Text style={{ color: "white" }}>Sign in</Text>
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
                firstName: firstName,
                lastName: lastName,
                email: email
            })
        })
            .then(response => response.json())
            .then(json => {
                console.log("ReponseJSON = " + json[0]["LAST_INSERT_ID()"]);
                this.setID(JSON.stringify(json[0]["LAST_INSERT_ID()"]));
            })
            // Unsuccessful Call to API
            .catch(err => {
                console.log(err);
            });
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async () => {
        console.log(
            "Attempting to sign in with " +
                this.state.userFirstName +
                " and " +
                this.state.userLastName +
                " and " +
                this.state.userEmail
        );
        this.handleLogin(
            this.state.userFirstName,
            this.state.userLastName,
            this.state.userEmail
        );
        this.props.navigation.navigate("App");
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
