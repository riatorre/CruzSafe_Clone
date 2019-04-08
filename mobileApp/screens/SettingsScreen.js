import React, { Component } from "react";
import {
    Text,
    AsyncStorage,
    SafeAreaView,
    Button,
    Platform
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
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-cog`}
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
                            <Text style={styles.header_text}>Settings</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        <Button title="Sign Out" onPress={this._signOutAsync} />
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

    // Function used to 'sign out' user. Clears AsyncStorage of all values
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate("Auth");
    };
}
export default SettingsScreen;
