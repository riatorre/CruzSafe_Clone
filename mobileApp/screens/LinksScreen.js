/*
 * LinksScreen.js
 * A Screen for displaying useful links to the user
 */

import React, { Component } from "react";
import {
    Linking,
    View,
    ScrollView,
    Image,
    Text,
    SafeAreaView,
    Platform,
    TouchableOpacity
} from "react-native";
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

class LinksScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({}) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-link`}
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
                            <Text style={styles.header_text}>Links</Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <ScrollView contentContainerStyle={styles.linksContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.linkDescriptionText}>
                                Community engagement and safety services at your
                                fingertips, available to everyone! Stay safe out
                                there! {"\n"}
                                {"\n"} -The CruzSafe Team
                            </Text>
                        </View>
                        {/* Individual Link*/}
                        <View style={styles.linkRow}>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/nightsafetyescort.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://tapride-saferide-ucsc.herokuapp.com/ride/#/"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Night Safety Escort
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/riskandsafetyservices.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://riskandsafety.ucsc.edu/"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Risk and Safety Services
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.linkRow}>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/healthservices.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://healthcenter.ucsc.edu"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Health Services
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/cprandbleedingcontrol.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://police.ucsc.edu/services/cpr-bcon.html"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        CPR and Bleeding Control
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.linkRow}>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/lostandfound.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://police.ucsc.edu/services/lost-and-found.html"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Lost and Found
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/publicsafetynumbers.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://police.ucsc.edu/services/dispatch.html"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Public Safety Numbers
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.linkRow}>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/interactivecrimemap.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://police.ucsc.edu/crime-prevention/crime-log-and-map.html"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Interactive Crime Map
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.linkContainer}>
                                <Image
                                    source={require("../assets/images/reportingcrimes.jpg")}
                                    style={styles.linkPicture}
                                />
                                <TouchableOpacity
                                    style={styles.linkbtn}
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://police.ucsc.edu/report/index.html"
                                        );
                                    }}
                                >
                                    <Text style={styles.linkText}>
                                        Reporting Crimes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
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
export default LinksScreen;
