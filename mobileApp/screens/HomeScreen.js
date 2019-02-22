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
    ScrollView,
    AsyncStorage,
    Alert
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
import { Camera, Permissions } from "expo";

import SelectableListScene from "./SelectableListScene";

import styles from "../components/styles.js";

var tagsList = [
    "Trash",
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting deficiency"
];

function createIncidentTypePicker(props) {
    return (
        <TouchableOpacity
            style={styles.dropdown_menu}
            onPress={() => {
                props.homeScreen.setIOSPickerVisible(true);
            }}
        >
            <Text style={{ marginRight: 5, fontSize: 14 }}>
                {props.homeScreen.state.incidentCategory
                    ? props.homeScreen.state.incidentCategory
                    : "Select Incident Type"}
            </Text>
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-dropdown`}
                style={{ fontSize: 14 }}
            />
        </TouchableOpacity>
    );
}

class HomeScreen extends Component {
    // State that should be used to record Report details & handle Modal Visibility.
    // Add, Update, or Remove entries as needed
    state = {
        reportModalVisible: false,
        cameraModalVisible: false,
        iOSPickerVisible: false,
        locationModalVisible: false,
        latitude: "",
        longitude: "",
        incidentCategory: "",
        incidentDesc: "",
        incidentLocationDesc: "",
        location: null,
        hasCameraPermission: null,
        hasLocationPermission: null,
        type: Camera.Constants.Type.back
    };

    setReportModalVisible(visible) {
        this.setState({ reportModalVisible: visible });
    }

    setCameraModalVisible(visible) {
        if (this.state.hasCameraPermission) {
            this.setState({ cameraModalVisible: visible });
        } else {
            this.getCameraPermission();
        }
    }

    setLocationModalVisible(visible) {
        if (this.state.hasLocationPermission) {
            this.setState({ locationModalVisible: visible });
        } else {
            this.getLocationPermission();
        }
    }

    setIOSPickerVisible(visible) {
        this.setState({ iOSPickerVisible: visible });
    }

    async getCameraPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === "granted") {
            this.setState({ hasCameraPermission: status === "granted" });
            this.getLocationPermission();
        } else {
            this.getCameraPermission();
        }
    }

    async getLocationPermission() {
        const { Location, Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(
            Permissions.LOCATION
        );
        if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true
            });
            this.setState({
                hasLocationPermission: status === "granted",
                location: loc,
                latitude: JSON.stringify(loc.coords.latitude),
                longitude: JSON.stringify(loc.coords.longitude)
            });
            console.log(
                "latitude:" +
                    loc.coords.latitude +
                    "\nlongitude:" +
                    loc.coords.longitude
            );
        } else {
            this.getLocationPermission();
        }
    }

    // If dectects unsubmitted report (incidentDesc or incidentLocationDesc),
    // ask the user what to do
    async continue() {
        var pre_report = JSON.parse(await AsyncStorage.getItem("unsub_report"));
        if (pre_report == null) {
            pre_report = {
                incidentDesc: "",
                incidentCategory: "",
                incidentLocationDesc: ""
            };
            this.storeItem("unsub_report", pre_report);
        }
        if (
            pre_report.incidentDesc !== "" ||
            pre_report.incidentLocationDesc !== ""
        ) {
            Alert.alert(
                "Continue?",
                "Detected an unsubmitted report, what do you want to do?",
                [
                    {
                        text: "Continue editting",
                        onPress: () => {
                            // If the user choose to continue editting previous report,
                            // reset all text states to previous one
                            this.setState({
                                incidentCategory: pre_report.incidentCategory,
                                incidentDesc: pre_report.incidentDesc,
                                incidentLocationDesc:
                                    pre_report.incidentLocationDesc
                            });
                        }
                    },
                    {
                        text: "Start a new one",
                        onPress: () => {
                            // If the user choose to start a new report,
                            // reset all text states to ""
                            this.setState({
                                incidentCategory: "",
                                incidentDesc: "",
                                incidentLocationDesc: ""
                            });
                        },
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        }
    }

    // When the user create a report, start detecting previous unsubmitted report
    async handleReport(visible) {
        this.setReportModalVisible(visible);
        this.delay = setTimeout(() => {
            this.continue();
        }, 100);
    }

    // store texts in AsyncStorage
    async storeItem(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error.message);
        }
    }

    // function used to handle submitting report to DB.
    // Utilizes a fetch stmt to call API that does the actual insertion
    // Not Async as to allow us to determine if we need to give the user an error message
    async handleSubmit() {
        // Must convert the Tag from a string to a Int for DB
        var incidentTagID = 0;
        for (i = 0; i < tagsList.length; i++) {
            if (tagsList[i] === this.state.incidentCategory) {
                incidentTagID = i;
                break;
            }
        }
        // Main Portion of the request, contains all metadata to be sent to link
        await fetch("https://cruzsafe.appspot.com/api/reports/submitReport", {
            // Defines what type of call is being made; above link is a POST request, so POST is needed Below
            method: "POST",
            // Metadata in regards as to what is expected to be sent/recieved
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
            body: JSON.stringify({
                mobileID: 1, //Set to 1 for now, will be a unique ID for logged in user once we setup Shibboleth
                incidentDesc: this.state.incidentDesc,
                incidentCategory: incidentTagID,
                incidentLocationDesc: this.state.incidentLocationDesc
            })
        })
            // Successful Call to API
            .then(() => {
                var unsub_report = {
                    incidentDesc: "",
                    incidentCategory: "",
                    incidentLocationDesc: ""
                };
                this.storeItem("unsub_report", unsub_report);
                return true;
            })
            // Unsuccessful Call to API
            .catch(err => {
                console.log(err);
                return false;
            });
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

    componentDidMount() {
        this.getCameraPermission();
    }

    render() {
        const IncidentTypePicker = createIncidentTypePicker;
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
                                                        "invalid URL provided: " +
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
                                                        "invalid URL provided: " +
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
                                    Alert.alert(
                                        "Confirmation",
                                        "Please make sure this report is not emergency",
                                        [
                                            {
                                                text: "Non emergency",
                                                // Run when it's not emergency
                                                onPress: () =>
                                                    this.handleReport(true)
                                            },
                                            {
                                                text: "Emergency",
                                                onPress: () => {
                                                    var url =
                                                        (Platform.OS === "ios"
                                                            ? "telprompt:"
                                                            : "tel:") + "911";
                                                    return Linking.canOpenURL(
                                                        url
                                                    ).then(canOpen => {
                                                        if (canOpen) {
                                                            return Linking.openURL(
                                                                url
                                                            ).catch(err =>
                                                                Promise.reject(
                                                                    err
                                                                )
                                                            );
                                                        } else {
                                                            Promise.reject(
                                                                new Error(
                                                                    "invalid URL provided: " +
                                                                        url
                                                                )
                                                            );
                                                        }
                                                    });
                                                },
                                                style: "cancel"
                                            }
                                        ],
                                        { cancelable: false }
                                    );
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
                        // Save current texts in AsyncStorage when the window closes
                        this.storeItem("unsub_report", {
                            incidentCategory: this.state.incidentCategory,
                            incidentDesc: this.state.incidentDesc,
                            incidentLocationDesc: this.state
                                .incidentLocationDesc
                        });
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
                                        this.setReportModalVisible(
                                            !this.state.reportModalVisible
                                        );
                                        // Save current texts in AsyncStorage when the window closes
                                        this.storeItem("unsub_report", {
                                            incidentCategory: this.state
                                                .incidentCategory,
                                            incidentDesc: this.state
                                                .incidentDesc,
                                            incidentLocationDesc: this.state
                                                .incidentLocationDesc
                                        });
                                    }}
                                />
                            </Left>
                            <Body>
                                <Text style={styles.footer_text}>Report</Text>
                            </Body>
                            <Right />
                        </Header>
                        <Content contentContainerStyle={styles.container}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 24 }}>
                                    Incident Type:
                                </Text>
                                <IncidentTypePicker homeScreen={this} />
                            </View>
                            {/* Report Body goes here. Currently has
                                a dropdown menu & a text field
                            */}
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

                            <Text style={{ fontSize: 24 }}>
                                Description of Location
                            </Text>

                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={4}
                                placeholder="Please describe the location of the Incident. (Floor #, room #, etc)"
                                onChangeText={incidentLocationDesc =>
                                    this.setState({ incidentLocationDesc })
                                }
                                value={this.state.incidentLocationDesc}
                            />
                            <View style={{ flexDirection: "row" }}>
                                {/* Button that allows Camera (Modal) to be opened */}
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => {
                                        this.setCameraModalVisible(true);
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-camera`}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={{ color: "white" }}>
                                        Attach Media
                                    </Text>
                                </TouchableOpacity>
                                {/* Button that allows Location (Modal) to be opened */}
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => {
                                        this.setLocationModalVisible(true);
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-pin`}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={{ color: "white" }}>
                                        Mark on Map
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                {/* Button that allows Modal to be closed */}
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => {
                                        this.setReportModalVisible(
                                            !this.state.reportModalVisible
                                        );
                                        // Save current texts in AsyncStorage when the window closes
                                        this.storeItem("unsub_report", {
                                            incidentCategory: this.state
                                                .incidentCategory,
                                            incidentDesc: this.state
                                                .incidentDesc,
                                            incidentLocationDesc: this.state
                                                .incidentLocationDesc
                                        });
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-close`}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={{ color: "white" }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                {/* Button that allows report to be sent */}
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => {
                                        if (
                                            this.state.incidentCategory != "" ||
                                            this.state.incidentDesc != "" ||
                                            this.state.incidentLocationDesc !=
                                                ""
                                        ) {
                                            if (this.handleSubmit()) {
                                                Alert.alert(
                                                    this.state
                                                        .incidentCategory +
                                                        " Report Submitted",
                                                    "Thank you for reporting. We will try our best to solve this issue as soon as possible.",
                                                    [
                                                        {
                                                            text: "OK",
                                                            onPress: () => {
                                                                this.setReportModalVisible(
                                                                    !this.state
                                                                        .reportModalVisible
                                                                );
                                                            }
                                                        },
                                                        {
                                                            text:
                                                                "Check the status of my report: ",
                                                            onPress: () => {
                                                                this.setReportModalVisible(
                                                                    !this.state
                                                                        .reportModalVisible
                                                                );
                                                            }
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                );
                                            } else {
                                                Alert.alert(
                                                    "Error",
                                                    "An error has occurred. Please try again later.",
                                                    [
                                                        {
                                                            text: "Ok",
                                                            onPress: () => {}
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }
                                        } else {
                                            Alert.alert(
                                                "Empty report",
                                                "Report should not be empty",
                                                [
                                                    {
                                                        text: "Back to edit",
                                                        onPress: () => {}
                                                    },
                                                    {
                                                        text:
                                                            "Cancel the report",
                                                        onPress: () => {
                                                            this.setReportModalVisible(
                                                                !this.state
                                                                    .reportModalVisible
                                                            );
                                                        }
                                                    }
                                                ],
                                                { cancelable: false }
                                            );
                                        }
                                        this.setState({
                                            incidentCategory: "",
                                            incidentDesc: "",
                                            incidentLocationDesc: ""
                                        });
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-send`}
                                        style={{ color: "white" }}
                                    />
                                    <Text style={{ color: "white" }}>
                                        Submit
                                    </Text>
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
                        {/* iOS picker Modal*/}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.iOSPickerVisible}
                            onRequestClose={() => {
                                this.setIOSPickerVisible(
                                    !this.state.iOSPickerVisible
                                );
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#000000C0"
                                }}
                            >
                                <View
                                    style={{
                                        width: 300,
                                        height: 200,
                                        backgroundColor: "#CCC",
                                        padding: 20
                                    }}
                                >
                                    <ScrollView>
                                        <SelectableListScene
                                            list={tagsList}
                                            onPressAction={selectedItem => {
                                                this.setState({
                                                    incidentCategory: selectedItem
                                                });
                                                this.setIOSPickerVisible(
                                                    !this.state.iOSPickerVisible
                                                );
                                            }}
                                        />
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        {/* Camera Modal. TODO: Replace with actual camera.*/}
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
                                    <Left>
                                        <Icon
                                            name={`${
                                                Platform.OS === "ios"
                                                    ? "ios"
                                                    : "md"
                                            }-arrow-back`}
                                            style={styles.icon}
                                            onPress={() => {
                                                this.setCameraModalVisible(
                                                    !this.state
                                                        .cameraModalVisible
                                                );
                                            }}
                                        />
                                    </Left>
                                    <Body />
                                    <Right />
                                </Header>
                                {/*
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
                                    */}
                                <View style={{ flex: 1 }}>
                                    <Camera
                                        style={{ flex: 1 }}
                                        type={this.state.type}
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
                                                            Camera.Constants
                                                                .Type.back
                                                                ? Camera
                                                                      .Constants
                                                                      .Type
                                                                      .front
                                                                : Camera
                                                                      .Constants
                                                                      .Type.back
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
                        {/* Location Modal. TODO: Replace with actual location.*/}
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.locationModalVisible}
                            onRequestClose={() => {
                                this.setLocationModalVisible(
                                    !this.state.locationModalVisible
                                );
                            }}
                        >
                            <Container>
                                <Header style={styles.header_modal}>
                                    <Left>
                                        <Icon
                                            name={`${
                                                Platform.OS === "ios"
                                                    ? "ios"
                                                    : "md"
                                            }-arrow-back`}
                                            style={styles.icon}
                                            onPress={() => {
                                                this.setLocationModalVisible(
                                                    !this.state
                                                        .locationModalVisible
                                                );
                                            }}
                                        />
                                    </Left>
                                    <Body />
                                    <Right />
                                </Header>
                                <Content
                                    contentContainerStyle={styles.container}
                                >
                                    <Text>Location</Text>
                                    <Button
                                        title="Close"
                                        onPress={() => {
                                            this.setLocationModalVisible(
                                                !this.state.locationModalVisible
                                            );
                                        }}
                                    />
                                </Content>
                                <Content
                                    contentContainerStyle={styles.container}
                                >
                                    <Text>
                                        {"latitude: " +
                                            this.state.latitude +
                                            ", longitude: " +
                                            this.state.longitude}
                                    </Text>
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
}
export default HomeScreen;
