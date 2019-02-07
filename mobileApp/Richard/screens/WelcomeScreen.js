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
    Button,
    AsyncStorage
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
                            <Button
                                title="Sign in!"
                                disabled={isDisabled}
                                onPress={this._signInAsync}
                            />
                        </Content>
                        <Footer style={styles.footer} />
                    </Container>
                </Swiper>
            </SafeAreaView>
        );
    }

    // Function used to 'sign' user in. Stores name into AsyncStorage
    _signInAsync = async () => {
        await AsyncStorage.setItem("userToken", this.state.username);
        this.props.navigation.navigate("App");
    };
}
export default WelcomeScreen;
