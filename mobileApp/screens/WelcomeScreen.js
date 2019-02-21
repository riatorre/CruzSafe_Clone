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
    state = { username: "", errorMessage: null };

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

    // function used to handle submitting report to DB.
    // Utilizes a fetch stmt to call API that does the actual insertion
    // Not Async as to allow us to determine if we need to give the user an error message
    async handleSubmit() {
        // Must convert the Tag from a string to a Int for DB
        var incidentTagID = 0;
        for (i = 0; i < tagsList.length; i++) {
            if (tagsList[i] === this.state.incidentCategory) {
                incidentTagID = i;
                break;
            }
        }
        // Main Portion of the request, contains all metadata to be sent to link
        await fetch("https://cruzsafe.appspot.com/api/reports/submitReport", {
            // Defines what type of call is being made; above link is a POST request, so POST is needed Below
            method: "POST",
            // Metadata in regards as to what is expected to be sent/recieved
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
            body: JSON.stringify({
                mobileID: 1, //Set to 1 for now, will be a unique ID for logged in user once we setup Shibboleth
                incidentDesc: this.state.incidentDesc,
                incidentCategory: incidentTagID,
                incidentLocationDesc: this.state.incidentLocationDesc
            })
        })
            // Successful Call to API
            .then(() => {
                return true;
            })
            // Unsuccessful Call to API
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async () => {
        await AsyncStorage.setItem("userToken", this.state.username);
        this.props.navigation.navigate("App");
    };
}
export default WelcomeScreen;
