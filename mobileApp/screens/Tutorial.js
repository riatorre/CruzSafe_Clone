/*
 * Tutorial.js
 * Will create an about us page that tells who we are ...
 */

import React, { Component } from "react";
import { Text, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import {
    Container,
    Header,
    Content,
    Footer,
    Left,
    Right,
    Body,
    Icon
} from "native-base";

import tutorialParams from "../navigation/AppNavigator.js";
import styles from "../components/styles.js";

class Tutorial extends Component {
    static navigationOptions = {
        // Drawer Name
        drawerLabel: "Tutorial",
        //Drawer Icon
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${
                    Platform.OS === "ios" ? "ios" : "md"
                }-help-circle-outline`}
                style={{ fontSize: 24, color: tintColor }}
            />
        )
    };
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            {/* Icon used to open Side Drawer */}
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-menu`}
                                style={styles.icon}
                                onPress={() =>
                                    this.props.navigation.openDrawer()
                                }
                            />
                        </Left>
                        <Body>
                            {/* Center of Header */}
                            <Text style={styles.header_text}>Tutorial</Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <Content contentContainerStyle={styles.container}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                this.props.navigation.navigate("Swiper");
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "white"
                                }}
                            >
                                Launch Tutorial
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                console.log("launch tour");
                                tutorialParams.tutorialMode = true;
                                this.props.navigation.navigate("Home");
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "white"
                                }}
                            >
                                Launch Tour
                            </Text>
                        </TouchableOpacity>
                    </Content>
                    <Footer style={styles.footer}>
                        <Left
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                        <Body
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {/* Center of Footer */}
                            <Text style={styles.footer_text}>CruzSafe</Text>
                        </Body>
                        <Right
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                    </Footer>
                </Container>
            </SafeAreaView>
        );
    }
}
export default Tutorial;
