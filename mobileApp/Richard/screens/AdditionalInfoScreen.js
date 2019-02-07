/*
	Users are enabled the ability to add additional information to greater aid police
	in contacting them/aiding them. Information is stored locally and sent along with the
	report. 

	Fields:
	- Emergency contacts
	- Full mailing address
	- Medical info
	- Other information
*/

import React, { Component } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  SafeAreaView,
  Image
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

class AdditionalInfoScreen extends Component {
  static navigationOptions = {
    drawerLabel: "Additional Info",
    drawerIcon: ({ tintColor }) => (
      <Icon name="cog" style={{ fontSize: 24, color: tintColor }} />
    )
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Icon
                name="menu"
                style={styles.icon}
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Left>
            <Body>
              <Text style={styles.header_text}>Additional Info</Text>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={styles.container} />
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
}
export default AdditionalInfoScreen;
