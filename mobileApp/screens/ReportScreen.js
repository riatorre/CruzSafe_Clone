import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    ScrollView,
    AsyncStorage,
    AppState,
    Alert,
    Image,
    ActivityIndicator,
    Modal
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
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting Deficiency",
    "Excess Trash"
];

const LATITUDE = "36.9916";
const LONGITUDE = "-122.0583";
const newPre_report = {
    incidentDesc: "",
    incidentCategory: "",
    incidentLocationDesc: "",
    incidentLatitude: LATITUDE,
    incidentLongitude: LONGITUDE,
    unchangedLocation: true,
    imageURI: null
};

//Initialize tutorialParams. We will later pull the proper parameters.
var tutorialParams = {
    tips: false,
    reportOnboarding: false,
    thumbnailOnboarding: false,
    historyOnboarding: false,
    sidebarOnboarding: false,
    inHistoryOnboarding: false
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
        this.isIOS = Platform.OS === "ios";
    }

    state = {
        appState: AppState.currentState,
        hasCameraPermission: null,
        hasCameraRollPermission: null,
        hasNotificationPermission: null,
        hasRecordingPermission: null,
        hasLocationPermission: null,
        incidentCategory: "",
        incidentDesc: "",
        incidentLocationDesc: "",
        image: null,
        iOSPickerVisible: false,
        pre_report: null,
        isLoading: true,
        submitting: false,
        isSelectionTipVisible: false,
        isDescriptionTipVisible: false,
        isLocationTipVisible: false,
        isCameraTipVisible: false,
        isMapTipVisible: false,
        isSubmissionTipVisible: false
    };

    runTutorial() {
        if (
            tutorialParams.reportOnboarding == true &&
            tutorialParams.tips == true
        ) {
            Alert.alert(
                "Tour",
                "Would you like to take a tour of how to create a report?",
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            this.tourAlert();
                        }
                    },
                    {
                        text: "No",
                        onPress: () => {
                            tutorialParams.reportOnboarding = false;
                            this.setTutorialParams();
                        }
                    }
                ]
            );
        }
    }

    tourAlert() {
        if (tutorialParams.reportOnboarding && tutorialParams.tips) {
            Alert.alert(
                "Tour",
                "You are currently in tour mode, so this first report will not actually be submitted.",
                [
                    {
                        text: "Continue",
                        onPress: () => {
                            this.setState({ isSelectionTipVisible: true });
                        }
                    }
                ]
            );
        }
    }

    returnFromCamera(newImage) {
        this.getUnsubReport().then(pre_report => {
            pre_report.imageURI = newImage;
            this._isMounted &&
                this.setState({ image: newImage, pre_report: pre_report });
        });
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

    Media() {
        if (this.state.image.includes(".jpg")) {
            this.props.navigation.navigate("ImageView", {
                image: this.state.image
            });
        } else if (
            this.state.image.includes(".mp4") ||
            this.state.image.includes(".mov")
        ) {
            this.props.navigation.navigate("VideoPlay", {
                video: this.state.image
            });
        } else {
            console.log(
                "Incompatible File Type Encountered; object must be .jpg, .mp4, or .mov"
            );
        }
    }

    async getTutorialParams() {
        tutorialParams = JSON.parse(
            await AsyncStorage.getItem("tutorialParams")
        );
    }

    async setTutorialParams() {
        try {
            await AsyncStorage.setItem(
                "tutorialParams",
                JSON.stringify(tutorialParams)
            );
            this.setState({});
        } catch (error) {
            console.log(error.message);
        }
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

    /*
    async getNotificationPermission() {
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );
        if (status === "granted") {
            this._isMounted &&
                this.setState({
                    hasNotificationPermission: status === "granted"
                });
            this.getRecordingPermission();
        } else {
            Alert.alert(
                "Permission denied",
                "You need to enable notification for this app to receive response",
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
    */

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

    async getToken() {
        try {
            const token = await AsyncStorage.getItem("token");
            return token;
        } catch (error) {
            console.log(error.message);
        }
    }

    async handleSubmit() {
        // Must convert the Tag from a string to a Int for DB
        //this._isMounted && this.setState({ submitting: true });
        this.getUnsubReport().then(async pre_report => {
            var incidentTagID = 6;
            for (i = 0; i < tagsList.length; i++) {
                if (tagsList[i] === pre_report.incidentCategory) {
                    incidentTagID = i + 1;
                    break;
                }
            }

            const data = new FormData();
            const imageURI = this.state.image;
            if (imageURI != null) {
                // Set up form-data for POST request.
                // Split up imageURI to find filename with extension
                const imagePathArray = imageURI.split("/");
                const image = imagePathArray[imagePathArray.length - 1];
                // Split up filename and extension
                const imageArray = image.split(".");
                // Record extension
                const imageExtension = imageArray[imageArray.length - 1];
                // determine MimeType for multer to properly save the file
                var imageMimeType = "image/jpg";
                switch (imageExtension) {
                    case "jpg":
                        imageMimeType = "image/jpg";
                    case "jpeg":
                        imageMimeType = "image/jpeg";
                    case "png":
                        imageMimeType = "image/png";
                    case "gif":
                        imageMimeType = "image/gif";
                    case "mov":
                        imageMimeType = "video/quicktime";
                    case "mp4":
                        imageMimeType = "video/mp4";
                    default:
                        imageMimeType = "image/jpg";
                }
                data.append("media", {
                    uri: imageURI,
                    type: imageMimeType,
                    name: image
                });
            }
            // Begin storing all report data for submission
            data.append("mobileID", await this.getMobileID());
            data.append("incidentDesc", pre_report.incidentDesc);
            data.append("incidentCategory", incidentTagID);
            data.append(
                "incidentLocationDesc",
                pre_report.incidentLocationDesc
            );
            data.append("incidentLatitude", pre_report.incidentLatitude);
            data.append("incidentLongitude", pre_report.incidentLongitude);
            data.append(
                "incidentUnchangedLocation",
                pre_report.unchangedLocation ? 1 : 0
            );
            data.append("token", JSON.parse(await this.getToken()));

            if (tutorialParams.reportOnboarding) {
                Alert.alert(
                    "Congratulations!",
                    "You now understand the reporting process! Please file a real report whenever you encounter a non-emergency issue on campus that you want addressed.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                tutorialParams.reportOnboarding = false;
                                this.setTutorialParams();
                                this.props.navigation.goBack();
                            }
                        }
                    ],
                    { cancelable: false }
                );
                return;
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
                        "Content-Type": "multipart/form-data"
                    },
                    // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
                    body: data
                }
            )
                // Successful Call to API
                .then(response => response.json()) // Parse response into JSON
                .then(responseJSON => {
                    // Handle data
                    //this._isMounted && this.setState({ submitting: false });
                    if (responseJSON.message == null) {
                        // No Errors from DB
                        Alert.alert(
                            pre_report.incidentCategory +
                                " Report Submitted as #" +
                                responseJSON.incidentID,
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
                                                image: null,
                                                pre_report: newPre_report
                                            });
                                        this.storeUnsubReport(newPre_report);
                                        this.props.navigation.goBack();
                                    }
                                },
                                {
                                    text: "Check the status of my report",
                                    onPress: () => {
                                        this._isMounted &&
                                            this.setState({
                                                incidentCategory: "",
                                                incidentDesc: "",
                                                incidentLocationDesc: "",
                                                image: null,
                                                pre_report: newPre_report
                                            });
                                        this.storeUnsubReport(newPre_report);
                                        this.props.navigation.navigate(
                                            "ReportDetail",
                                            {
                                                itemId: responseJSON.incidentID,
                                                callBack: this.props.navigation.goBack.bind(
                                                    this
                                                )
                                            }
                                        );
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    } else {
                        // Error from DB
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
                        console.log(responseJSON.message);
                        return false;
                    }
                })
                // Unsuccessful Call to API; Error from Attempt to connect
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

    async componentDidMount() {
        this._isMounted = true;
        await this.getTutorialParams();
        this.getUnsubReport().then(pre_report => {
            this._isMounted &&
                this.setState({
                    incidentCategory: pre_report.incidentCategory,
                    incidentDesc: pre_report.incidentDesc,
                    incidentLocationDesc: pre_report.incidentLocationDesc,
                    image: pre_report.imageURI,
                    pre_report: pre_report,
                    isLoading: false
                });
            this.getCameraPermission();
        });
        AppState.addEventListener("change", this._handleAppStateChange);
        console.log("Mounting ReportScreen");
        this.runTutorial();
    }

    componentWillUnmount() {
        this._isMounted = false;
        AppState.removeEventListener("change", this._handleAppStateChange);
        this.getUnsubReport().then(pre_report => {
            pre_report.incidentCategory = this.state.incidentCategory;
            pre_report.incidentDesc = this.state.incidentDesc;
            pre_report.incidentLocationDesc = this.state.incidentLocationDesc;
            pre_report.imageURI = this.state.image;
            this.storeUnsubReport(pre_report);
        });
    }

    //pick image from gallery
    async pickImage() {
        if (this.state.hasCameraRollPermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "All",
                allowsEditing: false
            });
            if (!result.cancelled) {
                this.getUnsubReport().then(pre_report => {
                    pre_report.imageURI = result.uri;
                    this._isMounted &&
                        this.setState({
                            image: result.uri,
                            pre_report: pre_report
                        });
                });
            }
        } else {
            alert("This feature requires Camera Roll Permission to be Enabled");
        }
    }

    _handleAppStateChange = nextAppState => {
        console.log("ReportScreen handleStateChange");
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
                        image: pre_report.imageURI,
                        pre_report: pre_report
                    });
            });
        }
        this._isMounted && this.setState({ appState: nextAppState });
    };

    async stopTips() {
        tutorialParams.tips = false;
        await this.setTutorialParams();
    }

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
                        <View style={styles.reportContainer}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Text style={{ fontSize: 22 }}>
                                    Incident Type:
                                </Text>
                                <IncidentTypePicker homeScreen={this} />
                            </View>
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    this.isIOS &&
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isSelectionTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.selectionLocationIOS
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleSquare}>
                                    <Text style={styles.mainTipText}>
                                        Select the type of issue you want to
                                        report. For example, if you think the
                                        area is too dark, select “Lighting
                                        Deficiency”.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isSelectionTipVisible: false
                                            });
                                            this.setState({
                                                isDescriptionTipVisible: true
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isSelectionTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.selectionTriangle} />
                            </View>
                            <View>
                                <View
                                    animationType="fade"
                                    transparent={true}
                                    style={
                                        !this.isIOS &&
                                        tutorialParams.reportOnboarding &&
                                        tutorialParams.tips &&
                                        this.state.isSelectionTipVisible &&
                                        !(
                                            tutorialParams.thumbnailOnboarding &&
                                            image
                                        )
                                            ? styles.selectionLocationAndroid
                                            : styles.locationHidden
                                    }
                                >
                                    <View style={styles.tipBubbleSquare}>
                                        <Text style={styles.mainTipText}>
                                            Select the type of issue you want to
                                            report. For example, if you think
                                            the area is too dark, select
                                            “Lighting Deficiency”.
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isSelectionTipVisible: false
                                                });
                                                this.setState({
                                                    isDescriptionTipVisible: true
                                                });
                                            }}
                                        >
                                            <Text style={styles.continue}>
                                                Continue
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isSelectionTipVisible: false
                                                });
                                                this.stopTips();
                                            }}
                                        >
                                            <Text style={styles.stopTips}>
                                                Stop showing tips
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.selectionTriangle} />
                                </View>
                            </View>
                            <Text style={{ fontSize: 22 }}>
                                Incident Description:
                            </Text>

                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={4}
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
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    this.isIOS &&
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isDescriptionTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.descriptionLocationIOS
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleSquare}>
                                    <Text style={styles.mainTipText}>
                                        Describe the problem in detail. For
                                        example, “I almost tripped in the hall
                                        because it is very dark.”
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isDescriptionTipVisible: false
                                            });
                                            this.setState({
                                                isLocationTipVisible: true
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isDescriptionTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.descriptionTriangle} />
                            </View>
                            <View>
                                <View
                                    animationType="fade"
                                    transparent={true}
                                    style={
                                        !this.isIOS &&
                                        tutorialParams.reportOnboarding &&
                                        tutorialParams.tips &&
                                        this.state.isDescriptionTipVisible &&
                                        !(
                                            tutorialParams.thumbnailOnboarding &&
                                            image
                                        )
                                            ? styles.descriptionLocationAndroid
                                            : styles.locationHidden
                                    }
                                >
                                    <View style={styles.tipBubbleSquare}>
                                        <Text style={styles.mainTipText}>
                                            Describe the problem in detail. For
                                            example, “I almost tripped in the
                                            hall because it is very dark.”
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isDescriptionTipVisible: false
                                                });
                                                this.setState({
                                                    isLocationTipVisible: true
                                                });
                                            }}
                                        >
                                            <Text style={styles.continue}>
                                                Continue
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isDescriptionTipVisible: false
                                                });
                                                this.stopTips();
                                            }}
                                        >
                                            <Text style={styles.stopTips}>
                                                Stop showing tips
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.descriptionTriangle} />
                                </View>
                            </View>
                            <Text style={{ fontSize: 22 }}>
                                Description of Location:
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={2}
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
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    this.isIOS &&
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isLocationTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.locationLocationIOS
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleSquare}>
                                    <Text style={styles.mainTipText}>
                                        Clearly describe where you found the
                                        issue. For example, “Hallway outside
                                        Baskin Engineering room 102.”
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isLocationTipVisible: false
                                            });
                                            this.setState({
                                                isCameraTipVisible: true
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isLocationTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.locationTriangle} />
                            </View>
                            <View>
                                <View
                                    animationType="fade"
                                    transparent={true}
                                    style={
                                        !this.isIOS &&
                                        tutorialParams.reportOnboarding &&
                                        tutorialParams.tips &&
                                        this.state.isLocationTipVisible &&
                                        !(
                                            tutorialParams.thumbnailOnboarding &&
                                            image
                                        )
                                            ? styles.locationLocationAndroid
                                            : styles.locationHidden
                                    }
                                >
                                    <View style={styles.tipBubbleSquare}>
                                        <Text style={styles.mainTipText}>
                                            Clearly describe where you found the
                                            issue. For example, “Hallway outside
                                            Baskin Engineering room 102.”
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isLocationTipVisible: false
                                                });
                                                this.setState({
                                                    isCameraTipVisible: true
                                                });
                                            }}
                                        >
                                            <Text style={styles.continue}>
                                                Continue
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isLocationTipVisible: false
                                                });
                                                this.stopTips();
                                            }}
                                        >
                                            <Text style={styles.stopTips}>
                                                Stop showing tips
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.locationTriangle} />
                                </View>
                            </View>

                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    this.isIOS &&
                                    tutorialParams.thumbnailOnboarding &&
                                    tutorialParams.tips &&
                                    image
                                        ? styles.thumbnailLocationIOS
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleSmaller}>
                                    <Text style={styles.mainTipText}>
                                        You can click on the thumbnail below to
                                        view the full-size image/video.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            tutorialParams.thumbnailOnboarding = false;
                                            if (this.state.isCameraTipVisible) {
                                                this.state.isCameraTipVisible = false;
                                                this.state.isMapTipVisible = true;
                                            }
                                            this.setTutorialParams();
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            tutorialParams.thumbnailOnboarding = false;
                                            this.setTutorialParams();
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.thumbnailTriangle} />
                            </View>
                            {image && (
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Text style={{ fontSize: 22 }}>
                                            Attachment:
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                marginTop: 5,
                                                backgroundColor: "#E8E5E5",
                                                borderRadius: 5
                                            }}
                                            onPress={() => {
                                                this.Media();
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    height: undefined,
                                                    width: undefined
                                                }}
                                                source={{ uri: image }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isCameraTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.cameraLocation
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleBigger}>
                                    <Text style={styles.mainTipText}>
                                        If you wish to take a photo or video to
                                        add to the report, press the "Camera”
                                        button. If you would prefer to select
                                        one from the gallery, press “Gallery”.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isCameraTipVisible: false
                                            });
                                            this.setState({
                                                isMapTipVisible: true
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isCameraTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cameraTriangle1} />
                                <View style={styles.cameraTriangle2} />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                {/* Button that allows Camera (Modal) to be opened */}
                                <TouchableOpacity
                                    style={styles.reportBtnHalf}
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
                                        style={styles.btnTextBlack}
                                    />
                                    <Text style={styles.btnTextBlack}>
                                        Camera
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.reportBtnHalf}
                                    onPress={() => {
                                        this.pickImage();
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-image`}
                                        style={styles.btnTextBlack}
                                    />
                                    <Text style={styles.btnTextBlack}>
                                        Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* Button that allows Location (Modal) to be opened */}
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isMapTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.mapLocation
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleSmaller}>
                                    <Text style={styles.mainTipText}>
                                        To mark the location of the incident,
                                        press the “Mark on Map” button.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isMapTipVisible: false
                                            });
                                            this.setState({
                                                isSubmissionTipVisible: true
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isMapTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mapTriangle} />
                            </View>
                            <TouchableOpacity
                                style={styles.reportBtnFull}
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
                                    style={styles.btnTextBlack}
                                />
                                <Text style={styles.btnTextBlack}>
                                    Mark on Map
                                </Text>
                            </TouchableOpacity>
                            <View
                                animationType="fade"
                                transparent={true}
                                style={
                                    tutorialParams.reportOnboarding &&
                                    tutorialParams.tips &&
                                    this.state.isSubmissionTipVisible &&
                                    !(
                                        tutorialParams.thumbnailOnboarding &&
                                        image
                                    )
                                        ? styles.submissionLocation
                                        : styles.locationHidden
                                }
                            >
                                <View style={styles.tipBubbleBig}>
                                    <Text style={styles.mainTipText}>
                                        Press the “submit” button to test report
                                        submission (recall that it will not
                                        actually be sent while in tour mode), or
                                        “cancel” to erase the test report.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isSubmissionTipVisible: false
                                            });
                                        }}
                                    >
                                        <Text style={styles.continue}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isSubmissionTipVisible: false
                                            });
                                            this.stopTips();
                                        }}
                                    >
                                        <Text style={styles.stopTips}>
                                            Stop showing tips
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.submissionTriangle1} />
                                <View style={styles.submissionTriangle2} />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                {/* Button that allows Modal to be closed */}
                                <TouchableOpacity
                                    style={styles.reportBtnCancel}
                                    onPress={() => {
                                        tutorialParams.reportOnboarding = false;
                                        this.setTutorialParams();
                                        goBack();
                                    }}
                                >
                                    <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-close`}
                                        style={styles.btnTextWhite}
                                    />
                                    <Text style={styles.btnTextWhite}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                {/* Button that allows report to be sent */}
                                <TouchableOpacity
                                    style={styles.reportBtnSubmit}
                                    onPress={() => {
                                        if (
                                            this.state.incidentCategory != "" &&
                                            this.state.incidentDesc != "" &&
                                            this.state.incidentLocationDesc !=
                                                ""
                                        ) {
                                            this.handleSubmit();
                                        } else {
                                            Alert.alert(
                                                "Empty report",
                                                "Please select an Incident Type and provide a Description of the Incident and Location.",
                                                [
                                                    {
                                                        text: "Back to edit",
                                                        onPress: () => {}
                                                    },
                                                    {
                                                        text:
                                                            "Cancel the report",
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
                                        style={styles.btnTextWhite}
                                    />
                                    <Text style={styles.btnTextWhite}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                {/* iOS picker Modal*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.iOSPickerVisible}
                    onRequestClose={() => {
                        this.setIOSPickerVisible(!this.state.iOSPickerVisible);
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
                                        var pre_report = this.state.pre_report;
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.submitting}
                    onRequestClose={() => {}}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#CCCCCCC0"
                        }}
                    >
                        <ActivityIndicator size="large" color="#303060" />
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

export default ReportScreen;
