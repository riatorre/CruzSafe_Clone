/*
 * AboutUs.js
 * Will create an about us page that tells who we are ...
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

class AboutUs extends Component {
  static navigationOptions = {
    //Drawer Icon
    drawerIcon: ({ tintColor }) => (
      <Icon
        name={`${Platform.OS === "ios" ? "ios" : "md"}-contact`}
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
                name={`${Platform.OS === "ios" ? "ios" : "md"}-menu`}
                style={styles.icon}
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Left>
            <Body>
              {/* Center of Header */}
              <Text style={styles.header_text}>About US!</Text>
            </Body>
            <Right />
          </Header>
          {/* Main Body */}
          <Content contentContainerStyle={styles.container}>
            <Text>About US!</Text>
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
export default AboutUs;
