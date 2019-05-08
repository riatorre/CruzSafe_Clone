/*
 * AboutUs.js
 * Will create an about us page that tells who we are ...
 */

import React, { Component } from "react";
import { Text, Image, View, SafeAreaView, Platform } from "react-native";
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

import styles from "../components/styles.js";

class AboutUs extends Component {
    static navigationOptions = {
        // Drawer Name
        drawerLabel: "About Us",
        //Drawer Icon
        drawerIcon: ({}) => (
            <Icon
                name={`${
                    Platform.OS === "ios" ? "ios" : "md"
                }-information-circle-outline`}
                style={styles.drawerText}
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
                            <Text style={styles.header_text}>Our Team</Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <Content contentContainerStyle={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../assets/images/Rich.jpg")}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../assets/images/Jo.jpg")}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../assets/images/kali.jpg")}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../assets/images/umna.jpg")}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../assets/images/Arthur.jpg")}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                        <Text>
                            Kalinda Fraser {"\n"}
                            Arthurlot Li {"\n"}
                            Zhiyue Li {"\n"}
                            Youmna Shafiq {"\n"}
                            Richard Torres {"\n"}
                        </Text>
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
                            <Text style={styles.footer_text}>CruzSafe 211</Text>
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
export default AboutUs;
