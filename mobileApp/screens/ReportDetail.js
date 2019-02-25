/*
 * Report.js
 * A screen to display the detail of the report
 */

import React, { Component } from "react";
import { Text, SafeAreaView, Platform } from "react-native";
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

class ReportDetail extends Component {
    static navigationOptions = {
        // Drawer Name
        drawerLabel: "Report Detail",
        //Drawer Icon
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${
                    Platform.OS === "ios" ? "ios" : "md"
                }-information-circle-outline`}
                style={{ fontSize: 24, color: tintColor }}
            />
        )
    };
    render() {
        const { goBack } = this.props.navigation;
        const itemId = this.props.navigation.getParam("itemId", "NO-ID");
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            {/* Icon used to open Side Drawer */}
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-arrow-back`}
                                style={styles.icon}
                                onPress={() => goBack()}
                            />
                        </Left>
                        <Body>
                            {/* Center of Header */}
                            <Text style={styles.header_text}>
                                Report Detail
                            </Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <Content contentContainerStyle={styles.container}>
                        <Text>Report ID: {JSON.stringify(itemId)}</Text>
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
export default ReportDetail;
