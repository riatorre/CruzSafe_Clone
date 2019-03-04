import React, { Component } from "react";
import { SafeAreaView, Platform, Text } from "react-native";
import { Container, Header, Left, Right, Body, Icon } from "native-base";
import ImageViewer from "react-native-image-zoom-viewer";

import styles from "../components/styles.js";

class ImageView extends Component {
    render() {
        const { navigation } = this.props;
        const image = navigation.getParam("image", "Not available");
        const { goBack } = this.props.navigation;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header_image}>
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
                            <Text style={styles.footer_text}>Image</Text>
                        </Body>
                        <Right />
                    </Header>
                    <ImageViewer
                        imageUrls={[{ url: image }]}
                        backgroundColor="black"
                    />
                </Container>
            </SafeAreaView>
        );
    }
}
export default ImageView;
