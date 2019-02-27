//camera modal

import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Platform,
    Modal,
    ScrollView,
    AsyncStorage,
    Alert,
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

import { Camera, ImagePicker } from "expo";

import styles from "../components/styles.js";

class CameraModal extends Component {
    state = {
        homeScreen: null,
        cameraModalVisible: false,
        hasCameraPermission: null,
        hasCameraRollPermission: null,
        hasRecordingPermission: null,
        type: Camera.Constants.Type.back
    };

    async takePhoto(data) {
        console.log(data.uri);
        this.homeScreen.setState({ image: data.uri });
    }

    render() {
        this.homeScreen = this.props.homeScreen;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.homeScreen.state.cameraModalVisible}
                onRequestClose={() => {
                    this.homeScreen.setCameraModalVisible(
                        !this.homeScreen.state.cameraModalVisible
                    );
                }}
            >
                <Container>
                    <Header style={styles.header_modal}>
                        <Left>
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-arrow-back`}
                                style={styles.icon}
                                onPress={() => {
                                    this.homeScreen.setCameraModalVisible(
                                        !this.homeScreen.state
                                            .cameraModalVisible
                                    );
                                }}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.header_text}>Camera</Text>
                        </Body>
                        <Right />
                    </Header>
                    <View style={{ flex: 1 }}>
                        <Camera
                            style={{ flex: 1 }}
                            type={this.state.type}
                            ref={cam => {
                                this.camera = cam;
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "transparenb",
                                    flexDirection: "row"
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flex: 0.1,
                                        alignSelf: "flex-end",
                                        alignItems: "center"
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            type:
                                                this.state.type ===
                                                Camera.Constants.Type.back
                                                    ? Camera.Constants.Type
                                                          .front
                                                    : Camera.Constants.Type.back
                                        });
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            marginBottom: 10,
                                            color: "white"
                                        }}
                                    >
                                        {" "}
                                        Flip{" "}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 0.5,
                                        justifyContent: "flex-end",
                                        alignItems: "center"
                                    }}
                                    onPress={() => {
                                        this.camera
                                            .takePictureAsync()
                                            .then(data =>
                                                this.takePhoto(data).then(
                                                    this.homeScreen.setCameraModalVisible(
                                                        !this.homeScreen.state
                                                            .cameraModalVisible
                                                    )
                                                )
                                            );
                                    }}
                                >
                                    <Text style={styles.btn}> Take photo </Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    </View>
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
            </Modal>
        );
    }
}
export default CameraModal;
