import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Platform
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
import { Camera } from "expo";

import styles from "../components/styles.js";

class CameraScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        cameraLoading: true,
        image: null,
        flash: "off",
        recording: false,
        isTakingImage: false,
        type: Camera.Constants.Type.back
    };

    async saveMedia(media) {
        this._isMounted && this.setState({ image: media.uri });
    }

    async takePhoto(goBack) {
        setTimeout(() => {
            this._isMounted &&
                this.setState({
                    isTakingImage: true
                });
        }, 1);
        await this.camera.takePictureAsync({
            quality: 0.5,
            onPictureSaved: photo => {
                this._isMounted &&
                    this.setState({
                        isTakingImage: false
                    });
                this.saveMedia(photo);
                goBack();
            }
        });
    }

    async recordVideo(goBack) {
        if (!this.state.recording) {
            setTimeout(() => {
                this._isMounted &&
                    this.setState({
                        recording: true
                    });
            }, 1);
            const video = await this.camera.recordAsync({ maxDuration: 5 });
            this.saveMedia(video);
            goBack();
        } else {
            this.camera.stopRecording();
            this._isMounted &&
                this.setState({
                    recording: false
                });
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        const { image } = this.state;
        this._isMounted = false;
        if (image != null) {
            params.callBack(image);
        }
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
                            flashMode={this.state.flash}
                            autoFocus={"on"}
                            onCameraReady={() => {
                                this._isMounted &&
                                    this.setState({ cameraLoading: false });
                            }}
                            ref={cam => {
                                this.camera = cam;
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    padding: 20,
                                    backgroundColor: "transparenb",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    alignItems: "center"
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: "transparentb",
                                        flexDirection: "row"
                                    }}
                                >
                                    <TouchableOpacity
                                        style={
                                            this.state.cameraLoading
                                                ? styles.btn_disabled
                                                : styles.btn
                                        }
                                        onPress={() => {
                                            if (this.state.flash === "off") {
                                                this._isMounted &&
                                                    this.setState({
                                                        flash: "torch"
                                                    });
                                            } else {
                                                this._isMounted &&
                                                    this.setState({
                                                        flash: "off"
                                                    });
                                            }
                                        }}
                                        disabled={this.state.cameraLoading}
                                    >
                                        <Icon
                                            name={`${
                                                Platform.OS === "ios"
                                                    ? "ios"
                                                    : "md"
                                            }-${
                                                this.state.flash === "off"
                                                    ? "flash-off"
                                                    : "flash"
                                            }`}
                                            style={{ color: "white" }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={
                                            this.state.cameraLoading
                                                ? styles.btn_disabled
                                                : styles.btn
                                        }
                                        onPress={() => {
                                            this.takePhoto(goBack);
                                        }}
                                        disabled={this.state.cameraLoading}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: "white"
                                            }}
                                        >
                                            Take photo
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={
                                            this.state.cameraLoading
                                                ? styles.btn_disabled
                                                : styles.btn
                                        }
                                        onPress={() => {
                                            this.recordVideo(goBack);
                                        }}
                                        disabled={this.state.cameraLoading}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: "white"
                                            }}
                                        >
                                            Take Video
                                        </Text>
                                    </TouchableOpacity>
                                </View>
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

export default CameraScreen;
