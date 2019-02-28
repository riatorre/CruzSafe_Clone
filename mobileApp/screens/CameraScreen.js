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
        image: null,
        type: Camera.Constants.Type.back
    };

    async takePhoto(data) {
        console.log(data.uri);
        this._isMounted && this.setState({ image: data.uri });
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
                            flashMode={"auto"}
                            autoFocus={"on"}
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
                                        style={styles.btn}
                                        onPress={() => {
                                            this._isMounted &&
                                                this.setState({
                                                    type:
                                                        this.state.type ===
                                                        Camera.Constants.Type
                                                            .back
                                                            ? Camera.Constants
                                                                  .Type.front
                                                            : Camera.Constants
                                                                  .Type.back
                                                });
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: "white"
                                            }}
                                        >
                                            Flip
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.btn}
                                        onPress={() => {
                                            this.camera.takePictureAsync({
                                                quality: 0.5,
                                                onPictureSaved: data => {
                                                    this.takePhoto(data).then(
                                                        goBack()
                                                    );
                                                }
                                            });
                                        }}
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
