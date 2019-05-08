import React, { Component } from "react";
import {
    Text,
    AsyncStorage,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert
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
import HomeScreen from "./HomeScreen.js";

/*
	Can also enable users the ability to add additional information to greater aid police
	in contacting them/aiding them. Information is stored locally and sent along with the
	report. 

	Fields:
	- Emergency contacts
	- Full mailing address
	- Medical info
	- Other information
*/

class SettingsScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({}) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-cog`}
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
                            <Text style={styles.header_text}>Settings</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={this._signOutAsync}
                        >
                            <Text style={{ color: "white" }}>Sign Out</Text>
                        </TouchableOpacity>
                    </Content>
                    <Content contentContainerStyle={styles.container}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={this._resetTutorialAsync}
                        >
                            <Text style={{ color: "white" }}>
                                Reset Tutorial
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

    // Function used to 'sign out' user. Clears AsyncStorage of all values
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate("Auth");
    };

    _resetTutorialAsync = async () => {
        Alert.alert(
            "Tutorial",
            "Are you sure you want to reset tips and review the intro dialog?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.setTutorialParams();
                    }
                },
                {
                    text: "No",
                    onPress: () => {}
                }
            ]
        );
    };
    async setTutorialParams() {
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

        this.props.navigation.navigate("Swiper");
    }
}

export default SettingsScreen;
