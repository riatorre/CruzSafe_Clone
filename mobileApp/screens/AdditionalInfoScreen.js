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

class AdditionalInfoScreen extends Component {
  // Defining how the Drawer Button appears
  static navigationOptions = {
    // Drawer Name
    drawerLabel: "Account",
    // Drawer Icon
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
              <Text style={styles.header_text}>More Info</Text>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={styles.container}>
            {/* Body of Screen */}
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
export default AdditionalInfoScreen;
