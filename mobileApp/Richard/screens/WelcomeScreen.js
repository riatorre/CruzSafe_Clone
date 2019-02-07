import React, { Component } from "react";
import {
  StatusBar,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  AsyncStorage
} from "react-native";
import { Container, Header, Content, Footer, Icon } from "native-base";
import Swiper from "react-native-swiper";

import styles from "../components/styles.js";

class WelcomeScreen extends Component {
  state = { username: "", errorMessage: null };

  render() {
    const isDisabled = this.state.username.length === 0;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Swiper showsButtons={true} loop={false} showsPagination={false}>
          <Container>
            <Header style={styles.header} />
            <Content contentContainerStyle={styles.container}>
              <Text style={{ fontSize: 36 }}>Welcome to</Text>
              <Image
                source={require("../assets/images/SCPD_Logo.png")}
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ fontSize: 36 }}>CruzSafe!</Text>
            </Content>
            <Footer style={styles.footer} />
          </Container>
          <Container>
            <Header style={styles.header} />
            <Content contentContainerStyle={styles.container}>
              <Text style={{ fontSize: 24 }}>Please enter a name</Text>
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Name"
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
              />
              <Button
                title="Sign in!"
                disabled={isDisabled}
                onPress={this._signInAsync}
              />
            </Content>
            <Footer style={styles.footer} />
          </Container>
        </Swiper>
      </SafeAreaView>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem("userToken", this.state.username);
    this.props.navigation.navigate("App");
  };
}
export default WelcomeScreen;
