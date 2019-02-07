/*
	Primary screen of the application. 
	Primary components include calling 911, calling non-emergency, and sending a report.

	Secondary components include buttons to lead to supplemental UCSC police info. 

	Also includes navigation to AdditionalInfoScreen, etc.
*/

import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Platform,
    Modal,
    Button,
    Picker
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

class HomeScreen extends Component {
    // State that should be used to record Report details & handle Modal Visibility.
    // Add, Update, or Remove entries as needed
    state = {
        reportModalVisible: false,
        cameraModalVisible: false
    };

    setReportModalVisible(visible) {
        this.setState({ reportModalVisible: visible });
    }

    setCameraModalVisible(visible) {
        this.setState({ cameraModalVisible: visible });
    }

    static navigationOptions = {
        drawerLabel: "Home",
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
                style={{ fontSize: 24, color: tintColor }}
            />
        )
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            {/* Icon used to open Side Drawer */}
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-menu`}
                                style={styles.icon}
                                onPress={() =>
                                    this.props.navigation.openDrawer()
                                }
                            />
                        </Left>
                        <Body>
                            <Text style={styles.header_text}>Home</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        {/* Traffic Light */}
                        <View style={styles.traffic_light}>
                            {/* Emergency Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#f00",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    var url =
                                        (Platform.OS === "ios"
                                            ? "telprompt:"
                                            : "tel:") + "911";
                                    return Linking.canOpenURL(url).then(
                                        canOpen => {
                                            if (canOpen) {
                                                return Linking.openURL(
                                                    url
                                                ).catch(err =>
                                                    Promise.reject(err)
                                                );
                                            } else {
                                                Promise.reject(
                                                    new Error(
                                                        "invalid URL provided " +
                                                            url
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }}
                            >
                                <Text>Emergency</Text>
                            </TouchableOpacity>
                            {/* Urgent Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#ff0",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    var url =
                                        (Platform.OS === "ios"
                                            ? "telprompt:"
                                            : "tel:") + "8314592231";
                                    return Linking.canOpenURL(url).then(
                                        canOpen => {
                                            if (canOpen) {
                                                return Linking.openURL(
                                                    url
                                                ).catch(err =>
                                                    Promise.reject(err)
                                                );
                                            } else {
                                                Promise.reject(
                                                    new Error(
                                                        "invalid URL provided " +
                                                            url
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }}
                            >
                                <Text>Urgent</Text>
                            </TouchableOpacity>
                            {/* Report Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#0f0",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    this.setReportModalVisible(true);
                                }}
                            >
                                <Text>Report</Text>
                            </TouchableOpacity>
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
                {/* Report Modal */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.reportModalVisible}
                    onRequestClose={() => {
                        this.setReportModalVisible(
                            !this.state.reportModalVisible
                        );
                    }}
                >
                    <Container>
                        <Header style={styles.header_modal}>
                            <Left />
                            <Body />
                            <Right />
                        </Header>
                        <Content contentContainerStyle={styles.container}>
                            {/* Report Body goes here. Currently has
                                a dropdown menu & a text field
                            */}
                            <Text style={{ fontSize: 24 }}>Incident Type</Text>
                            <View style={styles.picker_view}>
                                <Picker
                                    selectedValue={this.state.incidentCategory}
                                    mode="dropdown"
                                    style={styles.picker}
                                    onValueChange={itemValue =>
                                        this.setState({
                                            incidentCategory: itemValue
                                        })
                                    }
                                >
                                    <Picker.Item
                                        label="Placeholder 1"
                                        value="1"
                                    />
                                    <Picker.Item
                                        label="Placeholder 2"
                                        value="2"
                                    />
                                    <Picker.Item
                                        label="Placeholder 3"
                                        value="3"
                                    />
                                </Picker>
                            </View>
                            <Text style={{ fontSize: 24 }}>
                                Incident Description
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={6}
                                placeholder="Please enter a description of the incident"
                                onChangeText={incidentDesc =>
                                    this.setState({ incidentDesc })
                                }
                                value={this.state.incidentDesc}
                            />
                            {/* Button that allows Camera (Modal) to be opened */}
                            <Button
                                title="Open Camera"
                                onPress={() => {
                                    this.setCameraModalVisible(true);
                                }}
                            />
                            {/* Button that allows Modal to be closed */}
                            <Button
                                title="Close"
                                onPress={() => {
                                    this.setReportModalVisible(
                                        !this.state.reportModalVisible
                                    );
                                }}
                            />
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
                        {/* Camera Modal. May be replaced with direct connection to camera */}
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.cameraModalVisible}
                            onRequestClose={() => {
                                this.setCameraModalVisible(
                                    !this.state.cameraModalVisible
                                );
                            }}
                        >
                            <Container>
                                <Header style={styles.header_modal}>
                                    <Left />
                                    <Body />
                                    <Right />
                                </Header>
                                <Content
                                    contentContainerStyle={styles.container}
                                >
                                    <Text>Camera</Text>
                                    <Button
                                        title="Close"
                                        onPress={() => {
                                            this.setCameraModalVisible(
                                                !this.state.cameraModalVisible
                                            );
                                        }}
                                    />
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
                                        <Text style={styles.footer_text}>
                                            CruzSafe
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
                        </Modal>
                    </Container>
                </Modal>
            </SafeAreaView>
        );
    }

    // Did not work for unknown reasons.
    // Left for revision later
    // Modal does not appear to be working either...

    openLink = url => {
        return Linking.canOpenURL(url).then(canOpen => {
            if (canOpen) {
                return Linking.openURL(url).catch(err => Promise.reject(err));
            } else {
                Promise.reject(new Error("invalid URL provided ${url}"));
            }
        });
    };

    _handleEmergency = () => {
        this.openLink("${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}911");
    };

    _handleUrgent = () => {
        this.openLink(
            "${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}8314592231"
        );
    };

    _handleReport = () => {
        console.log("Report has been selected");
    };
}
export default HomeScreen;
