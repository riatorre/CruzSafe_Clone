import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Dimensions
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
import { Camera, MediaLibrary } from "expo";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

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
        type: Camera.Constants.Type.back
    };

    saveMedia = media => {
        this._isMounted &&
            this.setState({ recording: false, image: media.uri }, () =>
                this.props.navigation.goBack()
            );
    };

    takePhoto = () => {
        this.camera.takePictureAsync({
            quality: 0.5,
            onPictureSaved: photoData => {
                this.saveMedia(photoData);
            }
        });
    };

    takeVideo = async () => {
        const videoData = await this.camera.recordAsync({
            quality: Camera.Constants.VideoQuality["720p"],
            maxDuration: 5
        });
        const vid = await MediaLibrary.createAssetAsync(videoData.uri);
        const vidInfo = await MediaLibrary.getAssetInfoAsync(vid);
        MediaLibrary.deleteAssetsAsync(vid);
        if (vidInfo.duration >= 1) {
            this.saveMedia(videoData);
        } else {
            this.takePhoto();
        }
    };

    startCapture = () => {
        this._isMounted && this.setState({ recording: true });
    };

    stopCapture = () => {
        if (this.state.recording) this.camera.stopRecording();
    };

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
        var { width } = Dimensions.get("window");
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
                                    this.props.navigation.goBack();
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
                            style={{ flex: 1, flexDirection: "row" }}
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
                            <View style={styles.cameraColumn}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#AAA9",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 35,
                                        width: width / 6,
                                        height: width / 6,
                                        borderRadius: width / 12
                                    }}
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
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-${
                                            this.state.flash === "off"
                                                ? "flash-off"
                                                : "flash"
                                        }`}
                                        style={{ color: "white" }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cameraColumn}>
                                <TouchableOpacity
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                        width: width / 4,
                                        height: width / 4,
                                        borderRadius: width / 8,
                                        borderWidth: 4,
                                        borderColor: "#FFF"
                                    }}
                                    onPress={() => {
                                        this.takePhoto();
                                    }}
                                    onLongPress={() => {
                                        this.takeVideo();
                                    }}
                                    onPressIn={() => {
                                        this.startCapture();
                                    }}
                                    onPressOut={() => {
                                        this.stopCapture();
                                    }}
                                    disabled={this.state.cameraLoading}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "#FFFC",
                                            width: width / 5,
                                            height: width / 5,
                                            borderRadius: width / 10
                                        }}
                                    />
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
                            <Text style={styles.footer_text}>
                                {textConstants.footerText}
                            </Text>
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
