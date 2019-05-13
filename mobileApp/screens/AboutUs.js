/*
 * AboutUs.js
 * Will create an about us page that tells who we are ...
 */

import React, { Component } from "react";
import {
    Text,
    Image,
    View,
    SafeAreaView,
    Platform,
    Linking,
    ScrollView,
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
import { textConstants } from "../components/styles.js";

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
            <SafeAreaView style={{ flex: 2 }}>
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
                            <Text style={styles.header_text}>About Us</Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <ScrollView contentContainerStyle={styles.linksContainer}>
                        {/* Individual Person: Left Picture*/}
                        <View style={styles.AboutUSRow}>
                            <View style={styles.aboutUsPictureContainer}>
                                <Image
                                    source={require("../assets/images/Rich.jpg")}
                                    style={styles.aboutUsPicture}
                                />
                            </View>
                            <View style={styles.aboutUsTextContainer}>
                                <Text style={styles.aboutUsBoldText}>
                                    Richard Torres
                                </Text>
                                <Text style={styles.aboutUsText}>
                                    UCSC Computer Science Undergraduate Student
                                    {"\n"}
                                    {"\n"}Really, really hates Shibboleth. Like,
                                    he absolutely loathes it.
                                </Text>
                            </View>
                        </View>
                        {/* Individual Person: Right Picture*/}
                        <View style={styles.AboutUSRow}>
                            <View style={styles.aboutUsTextContainer}>
                                <Text style={styles.aboutUsBoldText}>
                                    Kalinda Fraser
                                </Text>
                                <Text style={styles.aboutUsText}>
                                    UCSC Computer Science Undergraduate Student
                                    {"\n"}
                                    {"\n"}Has something of an affinity for
                                    dropdown menus.
                                </Text>
                            </View>
                            <View style={styles.aboutUsPictureContainer}>
                                <Image
                                    source={require("../assets/images/kali.jpg")}
                                    style={styles.aboutUsPicture}
                                />
                            </View>
                        </View>
                        {/* Individual Person: Left Picture*/}
                        <View style={styles.AboutUSRow}>
                            <View style={styles.aboutUsPictureContainer}>
                                <Image
                                    source={require("../assets/images/Jo.jpg")}
                                    style={styles.aboutUsPicture}
                                />
                            </View>
                            <View style={styles.aboutUsTextContainer}>
                                <Text style={styles.aboutUsBoldText}>
                                    Zhiyue Li
                                </Text>
                                <Text style={styles.aboutUsText}>
                                    UCSC Computer Science Undergraduate Student
                                    {"\n"}
                                    {"\n"}What the heck are you still doing up?!
                                    Go to bed!
                                </Text>
                            </View>
                        </View>
                        {/* Individual Person: Right Picture*/}
                        <View style={styles.AboutUSRow}>
                            <View style={styles.aboutUsTextContainer}>
                                <Text style={styles.aboutUsBoldText}>
                                    Youmna Shafiq
                                </Text>
                                <Text style={styles.aboutUsText}>
                                    UCSC Computer Science Undergraduate Student
                                    {"\n"}
                                    {"\n"}Oh no. Are those stairs?
                                </Text>
                            </View>
                            <View style={styles.aboutUsPictureContainer}>
                                <Image
                                    source={require("../assets/images/umna.jpg")}
                                    style={styles.aboutUsPicture}
                                />
                            </View>
                        </View>
                        {/* Individual Person: Left Picture*/}
                        <View style={styles.AboutUSRow}>
                            <View style={styles.aboutUsPictureContainer}>
                                <Image
                                    source={require("../assets/images/Arthur.jpg")}
                                    style={styles.aboutUsPicture}
                                />
                            </View>
                            <View style={styles.aboutUsTextContainer}>
                                <Text style={styles.aboutUsBoldText}>
                                    Arthurlot Li
                                </Text>
                                <Text style={styles.aboutUsText}>
                                    UCSC Computer Science Undergraduate Student
                                    {"\n"}
                                    {"\n"}Look how they massacred my boy.
                                </Text>
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
                            <Text style={styles.footer_text}>
                                {textConstants.footerText}
                            </Text>
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
