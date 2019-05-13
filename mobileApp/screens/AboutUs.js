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
                name={`${Platform.OS === "ios" ? "ios" : "md"}-menu`}
                style={styles.icon}
                onPress={() => this.props.navigation.openDrawer()}
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
            {/* Individual Link*/}
            <View style={styles.AboutUSRow}>
              <View style={styles.AboutUSlinkContainer}>
                <Image
                  source={require("../assets/images/Rich.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <View style={styles.AboutUSlinkContainer}>
                <Text style={styles.AboutUSText}>
                  Richard Torres{"\n"}Computer Science, {"\n"} Undergraduate
                  Student {"\n"} University of California, Santa Cruz
                </Text>
              </View>
            </View>

            <View style={styles.linkRow}>
              <View style={styles.AboutUSlinkContainer}>
                <Text style={styles.AboutUSText}>
                  Zhiyue Li{"\n"}Computer Science, {"\n"} Undergraduate Student{" "}
                  {"\n"} University of California, Santa Cruz
                </Text>
              </View>
              <View style={styles.AboutUSlinkContainer}>
                <Image
                  source={require("../assets/images/Jo.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            </View>

            <View style={styles.linkRow}>
              <View style={styles.AboutUSlinkContainer}>
                <Image
                  source={require("../assets/images/kali.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <View style={styles.AboutUSlinkContainer}>
                <Text style={styles.AboutUSText}>
                  Kalinda Fraser{"\n"}Computer Science, {"\n"} Undergraduate
                  Student {"\n"} University of California, Santa Cruz
                </Text>
              </View>
            </View>

            <View style={styles.linkRow}>
              <View style={styles.AboutUSlinkContainer}>
                <Text style={styles.AboutUSText}>
                  Youmna Shafiq{"\n"}Computer Science, {"\n"} Undergraduate
                  Student {"\n"} University of California, Santa Cruz
                </Text>
              </View>
              <View style={styles.AboutUSlinkContainer}>
                <Image
                  source={require("../assets/images/umna.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            </View>

            <View style={styles.linkRow}>
              <View style={styles.AboutUSlinkContainer}>
                <Image
                  source={require("../assets/images/Arthur.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <View style={styles.AboutUSlinkContainer}>
                <Text style={styles.AboutUSText}>
                  Arthurlot Li{"\n"}Computer Science, {"\n"} Undergraduate
                  Student {"\n"} University of California, Santa Cruz
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
