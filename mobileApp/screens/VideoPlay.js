import React, { Component } from "react";
import { SafeAreaView, Platform, Text } from "react-native";
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Content,
    Icon
} from "native-base";
import { Video } from "expo";

import styles from "../components/styles.js";

class VideoPlay extends Component {
    render() {
        const { navigation } = this.props;
        const video = navigation.getParam("video", "Not available");
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
                            <Text style={styles.footer_text}>Video</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Video
                        source={{
                            uri: video
                        }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        useNativeControls
                        style={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                            alignSelf: "center"
                        }}
                    />
                </Container>
            </SafeAreaView>
        );
    }
}
export default VideoPlay;
