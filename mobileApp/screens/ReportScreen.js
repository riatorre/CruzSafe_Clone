import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Modal,
    ScrollView,
    AsyncStorage,
    AppState,
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
import { Permissions, Location, ImagePicker } from "expo";

import SelectableListScene from "./SelectableListScene";

import styles from "../components/styles.js";

const tagsList = [
    "Trash",
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting deficiency"
];

const LATITUDE = "36.9916";
const LONGITUDE = "-122.0583";
const newPre_report = {
    incidentDesc: "",
    incidentCategory: "",
    incidentLocationDesc: "",
    incidentLatitude: LATITUDE,
    incidentLongitude: LONGITUDE,
    unchangedLocation: true
};

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

class ReportScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        appState: AppState.currentState,
        hasCameraPermission: null,
        hasCameraRollPermission: null,
        hasRecordingPermission: null,
        hasLocationPermission: null,
        incidentCategory: "",
        incidentDesc: "",
        incidentLocationDesc: "",
        image: null,
        iOSPickerVisible: false,
        pre_report: null,
        isLoading: true
    };

    returnFromCamera(newImage) {
        this._isMounted && this.setState({ image: newImage });
    }

    returnFromLocation() {
        this.getUnsubReport().then(pre_report => {
            this._isMounted &&
                this.setState({
                    pre_report: pre_report
                });
        });
    }

    setIOSPickerVisible(visible) {
        this._isMounted && this.setState({ iOSPickerVisible: visible });
    }

    async getUnsubReport() {
        var pre_report = JSON.parse(await AsyncStorage.getItem("unsub_report"));
        if (pre_report == null) {
            pre_report = newPre_report;
            this.storeUnsubReport(pre_report);
        }
        return pre_report;
    }

    async getCameraPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === "granted") {
            this._isMounted &&
                this.setState({ hasCameraPermission: status === "granted" });
            this.getCameraRollPermission();
        } else {
            Alert.alert(
                "Permission denied",
                "You need to enable camera for this app",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            this.getCameraRollPermission();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    async getCameraRollPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === "granted") {
            this._isMounted &&
                this.setState({
                    hasCameraRollPermission: status === "granted"
                });
            this.getRecordingPermission();
        } else {
            Alert.alert(
                "Permission denied",
                "You need to grant file access for this app",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            this.getRecordingPermission();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    async getRecordingPermission() {
        const { status } = await Permissions.askAsync(
            Permissions.AUDIO_RECORDING
        );
        if (status === "granted") {
            this._isMounted &&
                this.setState({ hasRecordingPermission: status === "granted" });
            this.getLocationPermission();
        } else {
            Alert.alert(
                "Permission denied",
                "You need to enable recording for this app",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            this.getLocationPermission();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    async getLocationPermission() {
        const { Location, Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(
            Permissions.LOCATION
        );
        if (status === "granted") {
            this._isMounted &&
                this.setState({
                    hasLocationPermission: status === "granted"
                });
            this.getLocation();
        } else {
            alert("You need to enable location for this app");
        }
    }

    async getLocation() {
        try {
            var pre_report = this.state.pre_report;
            if (pre_report.unchangedLocation && !this.state.isLoading) {
                const loc = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                pre_report.incidentLatitude = loc.coords.latitude;
                pre_report.incidentLongitude = loc.coords.longitude;
                this._isMounted &&
                    this.setState({
                        pre_report: pre_report
                    });
                this.storeUnsubReport(pre_report);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Stores unsubmitted report into AsyncStorage
    // Used to allow easier transfer of data
    async storeUnsubReport(report) {
        try {
            await AsyncStorage.setItem("unsub_report", JSON.stringify(report));
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMobileID() {
        try {
            const id = await AsyncStorage.getItem("mobileID");
            return Number(id);
        } catch (error) {
            console.log(error.message);
        }
    }

    async handleSubmit() {
        // Must convert the Tag from a string to a Int for DB
        this.getUnsubReport().then(async pre_report => {
            var incidentTagID = 0;
            for (i = 0; i < tagsList.length; i++) {
                if (tagsList[i] === pre_report.incidentCategory) {
                    incidentTagID = i;
                    break;
                }
            }
            // Main Portion of the request, contains all metadata to be sent to link
            await fetch(
                "https://cruzsafe.appspot.com/api/reports/submitReport",
                {
                    // Defines what type of call is being made; above link is a POST request, so POST is needed Below
                    method: "POST",
                    // Metadata in regards as to what is expected to be sent/recieved
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
                    body: JSON.stringify({
                        mobileID: await this.getMobileID(), //Set to 1 for now, will be a unique ID for logged in user once we setup Shibboleth
                        incidentDesc: pre_report.incidentDesc,
                        incidentCategory: incidentTagID,
                        incidentLocationDesc: pre_report.incidentLocationDesc,
                        incidentLatitude: pre_report.incidentLatitude,
                        incidentLongitude: pre_report.incidentLongitude,
                        incidentUnchangedLocation: pre_report.unchangedLocation
                            ? 1
                            : 0
                    })
                }
            )
                // Successful Call to API
                .then(() => {
                    Alert.alert(
                        pre_report.incidentCategory + " Report Submitted",
                        "Thank you for reporting. We will try our best to solve this issue as soon as possible.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    this._isMounted &&
                                        this.setState({
                                            incidentCategory: "",
                                            incidentDesc: "",
                                            incidentLocationDesc: "",
                                            pre_report: newPre_report
                                        });
                                    this.storeUnsubReport(newPre_report);
                                    this.props.navigation.goBack();
                                }
                            },
                            {
                                text: "Check the status of my report: ",
                                onPress: () => {
                                    this._isMounted &&
                                        this.setState({
                                            incidentCategory: "",
                                            incidentDesc: "",
                                            incidentLocationDesc: "",
                                            pre_report: newPre_report
                                        });
                                    this.storeUnsubReport(newPre_report);
                                    this.props.navigation.navigate(
                                        "ReportDetail"
                                    );
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                })
                // Unsuccessful Call to API
                .catch(err => {
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
                    console.log(err);
                    return false;
                });
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUnsubReport().then(pre_report => {
            this._isMounted &&
                this.setState({
                    incidentCategory: pre_report.incidentCategory,
                    incidentDesc: pre_report.incidentDesc,
                    incidentLocationDesc: pre_report.incidentLocationDesc,
                    pre_report: pre_report,
                    isLoading: false
                });
            this.getCameraPermission();
        });
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentWillUnmount() {
        this._isMounted = false;
        AppState.removeEventListener("change", this._handleAppStateChange);
        this.getUnsubReport().then(pre_report => {
            pre_report.incidentCategory = this.state.incidentCategory;
            pre_report.incidentDesc = this.state.incidentDesc;
            pre_report.incidentLocationDesc = this.state.incidentLocationDesc;
            this.storeUnsubReport(pre_report);
        });
    }

    async pickImage() {
        if (this.state.hasCameraRollPermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "All",
                allowsEditing: false
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
        } else {
            alert("This feature requires Camera Roll Permission to be Enabled");
        }
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            this.getUnsubReport().then(pre_report => {
                this._isMounted &&
                    this.setState({
                        incidentCategory: pre_report.incidentCategory,
                        incidentDesc: pre_report.incidentDesc,
                        incidentLocationDesc: pre_report.incidentLocationDesc,
                        pre_report: pre_report
                    });
            });
        }
        this._isMounted && this.setState({ appState: nextAppState });
    };

    render() {
        const { goBack } = this.props.navigation;
        const IncidentTypePicker = createIncidentTypePicker;
        var { image } = this.state;
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
                                    // Save current texts in AsyncStorage when the window closes
                                    goBack();
                                }}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.footer_text}>Report</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        {/* Report Body goes here. Currently has
                                a dropdown menu & a text field
                            */}
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 24 }}>Incident Type:</Text>
                            <IncidentTypePicker homeScreen={this} />
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
                            onChangeText={incidentDesc => {
                                var pre_report = this.state.pre_report;
                                pre_report.incidentDesc = incidentDesc;
                                this._isMounted &&
                                    this.setState({
                                        incidentDesc: incidentDesc,
                                        pre_report: pre_report
                                    });
                                this.storeUnsubReport(pre_report);
                            }}
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
                            onChangeText={incidentLocationDesc => {
                                var pre_report = this.state.pre_report;
                                pre_report.incidentLocationDesc = incidentLocationDesc;
                                this._isMounted &&
                                    this.setState({
                                        incidentLocationDesc: incidentLocationDesc,
                                        pre_report: pre_report
                                    });
                                this.storeUnsubReport(pre_report);
                            }}
                            value={this.state.incidentLocationDesc}
                        />
                        {image && (
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: "grey",
                                    marginTop: 8,
                                    marginBottom: 8
                                }}
                            >
                                <Image
                                    source={{ uri: image }}
                                    style={{
                                        width: 125,
                                        height: 75
                                    }}
                                />
                            </View>
                        )}
                        <View style={{ flexDirection: "row" }}>
                            {/* Button that allows Camera (Modal) to be opened */}
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    if (this.state.hasCameraPermission) {
                                        this.props.navigation.navigate(
                                            "Camera",
                                            {
                                                callBack: this.returnFromCamera.bind(
                                                    this
                                                )
                                            }
                                        );
                                    } else {
                                        alert(
                                            "This feature requires Camera Permission to be Enabled"
                                        );
                                    }
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-camera`}
                                    style={{ color: "white" }}
                                />
                                <Text style={{ color: "white" }}>
                                    Open Camera
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    this.pickImage();
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-image`}
                                    style={{ color: "white" }}
                                />
                                <Text style={{ color: "white" }}>
                                    Open Gallery
                                </Text>
                            </TouchableOpacity>
                            {/* Button that allows Location (Modal) to be opened */}
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    if (this.state.hasLocationPermission) {
                                        this.props.navigation.navigate(
                                            "Location",
                                            {
                                                callBack: this.returnFromLocation.bind(
                                                    this
                                                )
                                            }
                                        );
                                    } else {
                                        alert(
                                            "This feature requires Location Permission to be Enabled"
                                        );
                                    }
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
                                    goBack();
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-close`}
                                    style={{ color: "white" }}
                                />
                                <Text style={{ color: "white" }}>Cancel</Text>
                            </TouchableOpacity>
                            {/* Button that allows report to be sent */}
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    if (
                                        this.state.incidentCategory != "" ||
                                        this.state.incidentDesc != "" ||
                                        this.state.incidentLocationDesc != ""
                                    ) {
                                        this.handleSubmit();
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
                                                    text: "Cancel the report",
                                                    onPress: () => {
                                                        goBack();
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    }
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-send`}
                                    style={{ color: "white" }}
                                />
                                <Text style={{ color: "white" }}>Submit</Text>
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
                                            var pre_report = this.state
                                                .pre_report;
                                            pre_report.incidentCategory = selectedItem;
                                            this._isMounted &&
                                                this.setState({
                                                    incidentCategory: selectedItem,
                                                    pre_report: pre_report
                                                });
                                            this.storeUnsubReport(pre_report);
                                            this.setIOSPickerVisible(
                                                !this.state.iOSPickerVisible
                                            );
                                        }}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </Container>
            </SafeAreaView>
        );
    }
}

export default ReportScreen;
