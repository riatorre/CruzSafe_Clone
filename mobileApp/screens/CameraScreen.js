import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert
} from "react-native";
import {
    Container,
    Header,
    Footer,
    Left,
    Right,
    Body,
    Icon
} from "native-base";
import { Camera, Permissions } from "expo";

import styles from "../components/styles.js";

class CameraScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    };

    async getCameraPermission(c) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === "granted") {
            this._isMounted &&
                this.setState({ hasCameraPermission: status === "granted" });
        } else if (c < 2) {
            this.getCameraPermission(c + 1);
        } else {
            Alert.alert(
                "Permission denied",
                "You need to enable camera for this app",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            this.props.navigation.goBack();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getCameraPermission(0);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-arrow-back`}
                                style={styles.icon}
                                onPress={() => {
                                    goBack();
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
                                        this._isMounted &&
                                            this.setState({
                                                type:
                                                    this.state.type ===
                                                    Camera.Constants.Type.back
                                                        ? Camera.Constants.Type
                                                              .front
                                                        : Camera.Constants.Type
                                                              .back
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
                                        console.log("about to photograph");
                                        this.camera
                                            .takePictureAsync()
                                            .then(data => console.log(data));
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            marginBottom: 10,
                                            color: "red"
                                        }}
                                    >
                                        {" "}
                                        Take photo{" "}
                                    </Text>
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
            </SafeAreaView>
        );
    }
}

export default CameraScreen;
