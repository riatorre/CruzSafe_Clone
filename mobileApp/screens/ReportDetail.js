/*
 * Report.js
 * A screen to display the detail of the report
 */

import React, { Component } from "react";
import { DrawerActions } from "react-navigation";
import { View, Text, SafeAreaView, Platform, Button } from "react-native";
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
    const { navigation } = this.props;
    const itemId = navigation.getParam("itemId", "NO-ID");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header style={styles.header}>
            <Left>
              {/* Icon used to open Side Drawer */}
              {/* <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-menu`}
                style={styles.icon}
                onPress={() => this.props.dispatch(DrawerActions.openDrawer())}
              /> */}
            </Left>
            <Body>
              {/* Center of Header */}
              <Text style={styles.header_text}>Report Detail</Text>
            </Body>
            <Right />
          </Header>

          <Content contentContainerStyle={styles.container}>
            <View
              style={{
                width: "90%",
                height: "85%",
                backgroundColor: "#FFFFFF80",
                padding: 10
              }}
            >
              {/* List of all Reports are here */}
              <View style={({ height: "50%" }, styles.itemContainer)}>
                <Text>Report ID: {JSON.stringify(itemId)}</Text>
                <Button title="History" onPress={this._showHistory} />
              </View>
            </View>
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
  _showHistory = () => {
    this.props.navigation.navigate("History");
  };
}
export default ReportDetail;
