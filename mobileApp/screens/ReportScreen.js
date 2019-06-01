import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
    AsyncStorage,
    AppState,
    Alert,
    Image,
    ActivityIndicator,
    ImageBackground,
    Modal,
    Keyboard,
    RNFS
} from "react-native";
import {
    Container,
    Header,
    Toast,
    Footer,
    Left,
    Right,
    Body,
    Icon,
    Root
} from "native-base";
import Swiper from "react-native-swiper";
import { Permissions, Location, ImagePicker } from "expo";

import SelectableListScene from "./SelectableListScene";

import GeoFencing from "react-native-geo-fencing";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

// TODO: Make this process automated for arbitrary lengths of tags.
const tagsList = [
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting Deficiency",
    "Excess Trash"
];

// TODO: Make this process automated for arbitrary lengths of tags.
// TODO: Make sure that if any tags don't have pictures, implement tagNull.jpg
const tagsImages = [
    require("../assets/images/tag1.jpg"),
    require("../assets/images/tag2.jpg"),
    require("../assets/images/tag3.jpg"),
    require("../assets/images/tag4.jpg"),
    require("../assets/images/tag5.jpg"),
    require("../assets/images/tag6.jpg")
];

const maxDescLength = 1000;
const maxLocationDescLength = 50;

const newPre_report = {
    incidentDesc: "",
    incidentCategory: "",
    incidentLocationDesc: "",
    incidentLatitude: null,
    incidentLongitude: null,
    unchangedLocation: true,
    imageURI: null
};

const maxTextHeight = Dimensions.get("window").height * 0.7;
const minTextHeight = Dimensions.get("window").height * 0.15;

const mainCampusPolygon = [
    { lat: 36.9973, lng: -122.071065 },
    { lat: 37.003264, lng: -122.067803 },
    { lat: 37.002577, lng: -122.050079 },
    { lat: 36.983451, lng: -122.046994 },
    { lat: 36.976337, lng: -122.05238 },
    { lat: 36.976062, lng: -122.057616 },
    { lat: 36.984249, lng: -122.069675 },
    { lat: 36.9973, lng: -122.071065 } // last point has to be same as first point
];

const coastalCampusPolygon = [
    { lat: 36.955097, lng: -122.066376 },
    { lat: 36.947878, lng: -122.06629 },
    { lat: 36.948186, lng: -122.062084 },
    { lat: 36.955217, lng: -122.062126 },
    { lat: 36.955097, lng: -122.066376 } // last point has to be same as first point
];

const geofence = [mainCampusPolygon, coastalCampusPolygon];

//Initialize tutorialParams. We will later pull the proper parameters.
var tutorialParams = {
    tips: false,
    reportOnboarding: false,
    thumbnailOnboarding: false,
    historyOnboarding: false,
    sidebarOnboarding: false,
    inHistoryOnboarding: false
};

/*
function createIncidentTypePicker(props) {
    return (
        <TouchableOpacity
            style={styles.dropdown_menu}
            onPress={() => {
                props.homeScreen.setIOSPickerVisible(true);
            }}
        >
            <Text style={styles.reportDropDown}>
                {props.homeScreen.state.incidentCategory
                    ? props.homeScreen.state.incidentCategory
                    : "Select type"}
            </Text>
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-dropdown`}
                style={{ fontSize: 14 }}
            />
        </TouchableOpacity>
    );
}
*/

/*
    Helper function that generates an array of incident touchableOpacity objects.
*/
function createIncidentPictures(props) {
    let incidentsComponent;
    // Create touchable opacity for each tag.
    incidentsComponent = tagsList.map(function(tag) {
        tagNumber = tagsList.indexOf(tag) + 1; // The actual tagNumber as present in the database
        tagClass = "tag" + tagNumber + "Container";
        // Create from default template (no picture)
        return (
            <TouchableOpacity
                key={tagNumber}
                class="incidentContainer"
                style={styles.incidentContainer}
                onPress={() => {
                    var pre_report = props.homeScreen.state.pre_report;
                    pre_report.incidentCategory = tag;
                    props.homeScreen._isMounted &&
                        props.homeScreen.setState({
                            incidentCategory: tag,
                            pre_report: pre_report
                        });
                    props.homeScreen.storeUnsubReport(pre_report);
                    // TODO: Change colors.
                    props.homeScreen.swiper.scrollBy(1);
                }}
            >
                <ImageBackground
                    source={tagsImages[tagNumber - 1]}
                    class="incidentPicture"
                    style={styles.incidentPicture}
                >
                    <View style={styles.incidentbtn}>
                        <Text class="incidentText" style={styles.incidentText}>
                            {tag}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    });
    let pairedArray = [];
    // Convert the array (1,1,1,1,1...) into pairs (2,2,2....2/1).
    for (i = 0; i < Math.floor(incidentsComponent.length / 2); i++) {
        pairedArray.push(
            pairComponents(
                incidentsComponent[i * 2],
                incidentsComponent[i * 2 + 1],
                i
            )
        );
    }
    // For stragglers (only 1 instead of 2; odd length)
    if (incidentsComponent.length % 2 != 0) {
        pairedArray.push(
            pairComponents(
                incidentsComponent[incidentsComponent.length - 1],
                <View
                    style={[
                        styles.incidentContainer,
                        {
                            backgroundColor: "#00000000"
                        }
                    ]}
                />,
                incidentsComponent.length - 1
            )
        );
    }
    return pairedArray;
}

function pairComponents(component1, component2, key) {
    return (
        <View key={key} style={styles.incidentRow}>
            <React.Fragment>
                {component1}
                {component2}
            </React.Fragment>
        </View>
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
        isSubmissionTipVisible: false,
        IncDescheight: 0,
        LocDescheight: 0
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
                            this._isMounted &&
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
            this._isMounted && this.setState({});
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
            console.log("GetLocation");
            var pre_report = this.state.pre_report;
            if (pre_report.unchangedLocation && !this.state.isLoading) {
                const loc = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                // if (await this.inGeofence(loc)) {
                if (
                    this.inGeofence({
                        lat: loc.coords.latitude,
                        lng: loc.coords.longitude
                    })
                ) {
                    pre_report.incidentLatitude = loc.coords.latitude;
                    pre_report.incidentLongitude = loc.coords.longitude;
                    this._isMounted &&
                        this.setState({
                            pre_report: pre_report
                        });
                    this.storeUnsubReport(pre_report);
                } else {
                    Toast.show({
                        text:
                            "Your current location is not on campus. Before submitting, please mark the campus location of the incident you wish to report.",
                        duration: 10000
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    inGeofence(location) {
        // location = { lat: LATITUDE, lng: LONGITUDE };
        for (i in geofence) {
            // if (await GeoFencing.containsLocation(location, geofence[i])) {
            if (this.ourContainsLocation(location, geofence[i])) {
                console.log("geofence true");
                return true;
            }
        }
        console.log("geofence false");
        return false;
    }

    ourContainsLocation(point, poly) {
        let x = point.lng;
        let y = point.lat;
        let inside = false;
        for (var i = 1; i < poly.length; i++) {
            if (
                poly[i].lat > y != poly[i - 1].lat > y &&
                x <
                    ((poly[i - 1].lng - poly[i].lng) * (y - poly[i].lat)) /
                        (poly[i - 1].lat - poly[i].lat) +
                        poly[i].lng
            ) {
                console.log(poly.length + " " + i);
                inside = !inside;
            }
        }
        return inside;
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
        this._isMounted && this.setState({ submitting: true });
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
            data.append("incidentDesc", pre_report.incidentDesc.trim());
            data.append("incidentCategory", incidentTagID);
            data.append(
                "incidentLocationDesc",
                pre_report.incidentLocationDesc.trim()
            );
            data.append("incidentLatitude", pre_report.incidentLatitude);
            data.append("incidentLongitude", pre_report.incidentLongitude);
            data.append(
                "incidentUnchangedLocation",
                pre_report.unchangedLocation ? 1 : 0
            );
            data.append("token", JSON.parse(await this.getToken()));

            if (tutorialParams.reportOnboarding) {
                this._isMounted &&
                    this.setState({ submitting: false }, () => {
                        setTimeout(() => {
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
                        });
                    });
            } else {
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
                    .then(async responseJSON => {
                        // Handle data
                        this._isMounted &&
                            this.setState({ submitting: false }, () => {
                                setTimeout(() => {
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
                                                                incidentCategory:
                                                                    "",
                                                                incidentDesc:
                                                                    "",
                                                                incidentLocationDesc:
                                                                    "",
                                                                image: null,
                                                                pre_report: newPre_report
                                                            });
                                                        this.storeUnsubReport(
                                                            newPre_report
                                                        );
                                                        this.props.navigation.goBack();
                                                    }
                                                },
                                                {
                                                    text:
                                                        "Check the status of my report",
                                                    onPress: () => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                incidentCategory:
                                                                    "",
                                                                incidentDesc:
                                                                    "",
                                                                incidentLocationDesc:
                                                                    "",
                                                                image: null,
                                                                pre_report: newPre_report
                                                            });
                                                        this.storeUnsubReport(
                                                            newPre_report
                                                        );
                                                        this.props.navigation.navigate(
                                                            "ReportDetail",
                                                            {
                                                                itemId:
                                                                    responseJSON.incidentID,
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
                                }, 500);
                            });
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
            }
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
        //console.log("Mounting ReportScreen");
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
        //console.log("ReportScreen handleStateChange");
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
        /*const IncidentTypePicker = createIncidentTypePicker;*/
        const IncidentPictures = createIncidentPictures;
        var { image } = this.state;
        return (
            <Root>
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
                        <Swiper
                            loop={false}
                            showsButtons={true}
                            ref={swiper => {
                                this.swiper = swiper;
                            }}
                        >
                            <View style={styles.container}>
                                {/* REPORT STYLING: INCIDENT TYPE */}
                                <View style={styles.reportContainer}>
                                    <View style={styles.reportSubcontainer}>
                                        {/*<Text
                                            style={{
                                                alignSelf: "center",
                                                fontSize: 30
                                            }}
                                        >
                                            
                                        </Text>*/}
                                        <Text
                                            style={styles.fieldHeaderBackground}
                                        >
                                            Select Category:
                                        </Text>
                                        {/*Primary container of all incidents. To be populated.*/}
                                        <View
                                            style={
                                                styles.incidentsScrollContainer
                                            }
                                        >
                                            <ScrollView
                                                class="incidentsContainer"
                                                contentContainerStyle={
                                                    styles.incidentsContainer
                                                }
                                            >
                                                <IncidentPictures
                                                    homeScreen={this}
                                                />
                                            </ScrollView>
                                        </View>
                                        <Text
                                            style={styles.fieldFooterBackground}
                                        />
                                        {/*<IncidentTypePicker homeScreen={this} />*/}
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isSelectionTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.selectionLocationIOS
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSquare}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Select the type of issue you
                                                    want to report. For example,
                                                    if you think the area is too
                                                    dark, select “Lighting
                                                    Deficiency”.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSelectionTipVisible: false,
                                                                isDescriptionTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSelectionTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.selectionTriangle}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                !this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isSelectionTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.selectionLocationAndroid
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSquare}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Select the type of issue you
                                                    want to report. For example,
                                                    if you think the area is too
                                                    dark, select “Lighting
                                                    Deficiency”.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSelectionTipVisible: false,
                                                                isDescriptionTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSelectionTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.selectionTriangle}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.container}>
                                {/* REPORT STYLING: INCIDENT DESCRIPTION */}
                                <View style={styles.reportContainer}>
                                    <View style={styles.reportSubcontainer}>
                                        <Text
                                            style={styles.fieldHeaderBackground}
                                        >
                                            Describe Issue:
                                        </Text>

                                        <TextInput
                                            autoCapitalize="sentences"
                                            multiline={true}
                                            placeholder="Please describe the problem"
                                            maxLength={maxDescLength}
                                            onChangeText={incidentDesc => {
                                                if (
                                                    incidentDesc.slice(-1) ===
                                                    "\n"
                                                ) {
                                                    this.swiper.scrollBy(1);
                                                    Keyboard.dismiss();
                                                } else {
                                                    var pre_report = this.state
                                                        .pre_report;
                                                    pre_report.incidentDesc = incidentDesc;
                                                    this._isMounted &&
                                                        this.setState({
                                                            incidentDesc: incidentDesc,
                                                            pre_report: pre_report
                                                        });
                                                    this.storeUnsubReport(
                                                        pre_report
                                                    );
                                                }
                                            }}
                                            onContentSizeChange={event =>
                                                this._isMounted &&
                                                this.setState({
                                                    IncDescheight:
                                                        event.nativeEvent
                                                            .contentSize.height
                                                })
                                            }
                                            style={[
                                                styles.textInput,
                                                {
                                                    height: Math.min(
                                                        maxTextHeight,
                                                        Math.max(
                                                            minTextHeight,
                                                            this.state
                                                                .IncDescheight
                                                        )
                                                    )
                                                }
                                            ]}
                                            value={this.state.incidentDesc}
                                        />
                                        <Text
                                            style={styles.fieldFooterBackground}
                                        >
                                            Characters Left:{" "}
                                            {maxDescLength -
                                                this.state.incidentDesc.length}
                                            /{maxDescLength}
                                        </Text>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isDescriptionTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.descriptionLocationIOS
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmaller}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Describe the problem in
                                                    detail. For example, “I
                                                    almost tripped in the hall
                                                    because it is very dark.”
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isDescriptionTipVisible: false,
                                                                isLocationTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isDescriptionTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={
                                                    styles.descriptionTriangle
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                !this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isDescriptionTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.descriptionLocationAndroid
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmaller}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Describe the problem in
                                                    detail. For example, “I
                                                    almost tripped in the hall
                                                    because it is very dark.”
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isDescriptionTipVisible: false,
                                                                isLocationTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isDescriptionTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={
                                                    styles.descriptionTriangle
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.container}>
                                {/* REPORT STYLING: DESCRIPTION OF LOCATION */}
                                <View style={styles.reportContainer}>
                                    <View style={styles.reportSubcontainer}>
                                        <Text
                                            style={styles.fieldHeaderBackground}
                                        >
                                            Specify Location:
                                        </Text>
                                        <TextInput
                                            autoCapitalize="sentences"
                                            multiline={true}
                                            maxLength={maxLocationDescLength}
                                            placeholder="Please describe the location (floor #, room #, etc)"
                                            onChangeText={incidentLocationDesc => {
                                                if (
                                                    incidentLocationDesc.slice(
                                                        -1
                                                    ) === "\n"
                                                ) {
                                                    this.swiper.scrollBy(1);
                                                    Keyboard.dismiss();
                                                } else {
                                                    var pre_report = this.state
                                                        .pre_report;
                                                    pre_report.incidentLocationDesc = incidentLocationDesc;
                                                    this._isMounted &&
                                                        this.setState({
                                                            incidentLocationDesc: incidentLocationDesc,
                                                            pre_report: pre_report
                                                        });
                                                    this.storeUnsubReport(
                                                        pre_report
                                                    );
                                                }
                                            }}
                                            onContentSizeChange={event =>
                                                this.setState({
                                                    LocDescheight:
                                                        event.nativeEvent
                                                            .contentSize.height
                                                })
                                            }
                                            style={[
                                                styles.textInput,
                                                {
                                                    height: Math.min(
                                                        maxTextHeight,
                                                        Math.max(
                                                            minTextHeight,
                                                            this.state
                                                                .LocDescheight
                                                        )
                                                    )
                                                }
                                            ]}
                                            value={
                                                this.state.incidentLocationDesc
                                            }
                                        />
                                        <Text
                                            style={styles.fieldFooterBackground}
                                        >
                                            Characters Left:{" "}
                                            {maxLocationDescLength -
                                                this.state.incidentLocationDesc
                                                    .length}
                                            /{maxLocationDescLength}
                                        </Text>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isLocationTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.locationLocationIOS
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmaller}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Clearly describe where you
                                                    found the issue. For
                                                    example, “Hallway outside
                                                    Baskin Engineering room
                                                    102.”
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isLocationTipVisible: false,
                                                                isCameraTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isLocationTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.locationTriangle}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                !this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isLocationTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.locationLocationAndroid
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmaller}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Clearly describe where you
                                                    found the issue. For
                                                    example, “Hallway outside
                                                    Baskin Engineering room
                                                    102.”
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isLocationTipVisible: false,
                                                                isCameraTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isLocationTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.locationTriangle}
                                            />
                                        </View>
                                    </View>

                                    <View
                                        animationType="fade"
                                        transparent={true}
                                        style={
                                            this.isIOS &&
                                            tutorialParams.reportOnboarding &&
                                            tutorialParams.thumbnailOnboarding &&
                                            tutorialParams.tips &&
                                            image
                                                ? styles.thumbnailLocationIOS
                                                : styles.locationHidden
                                        }
                                    >
                                        <View style={styles.tipBubbleSmallest}>
                                            <Text style={styles.mainTipText}>
                                                You can click on the thumbnail
                                                below to view the full-size
                                                image/video.
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    tutorialParams.thumbnailOnboarding = false;
                                                    if (
                                                        this.state
                                                            .isCameraTipVisible
                                                    ) {
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
                                        <View
                                            style={styles.thumbnailTriangle}
                                        />
                                    </View>

                                    <View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                !this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.thumbnailOnboarding &&
                                                tutorialParams.tips &&
                                                image
                                                    ? styles.thumbnailLocationAndroid
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmallest}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    You can click on the
                                                    thumbnail below to view the
                                                    full-size image/video.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        tutorialParams.thumbnailOnboarding = false;
                                                        if (
                                                            this.state
                                                                .isCameraTipVisible
                                                        ) {
                                                            this.state.isCameraTipVisible = false;
                                                            this.state.isMapTipVisible = true;
                                                        }
                                                        this.setTutorialParams();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
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
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.thumbnailTriangle}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.container}>
                                {/* REPORT STYLING: OPTIONAL ATTACHMENTS */}
                                <View style={styles.reportContainer}>
                                    <View style={styles.reportSubcontainer}>
                                        <Text
                                            style={styles.fieldHeaderBackground}
                                        >
                                            Optional Attachments:
                                        </Text>
                                        {image ? (
                                            <TouchableOpacity
                                                style={styles.reportBtnImg}
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
                                        ) : (
                                            <View style={styles.textInput}>
                                                <Text
                                                    style={{
                                                        alignSelf: "center"
                                                    }}
                                                >
                                                    No Image/Video Selected
                                                </Text>
                                            </View>
                                        )}
                                        {/*<Text style={styles.fieldFooterBackground}>
                                        Optional Image / Video
                                    </Text>*/}
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state.isCameraTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.cameraLocationIOS
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSquare}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    If you wish to take a photo
                                                    or video to add to the
                                                    report, press the "Camera”
                                                    button. If you would prefer
                                                    to select one from the
                                                    gallery, press “Gallery”.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isCameraTipVisible: false,
                                                                isMapTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isCameraTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={styles.cameraTriangle1}
                                            />
                                            <View
                                                style={styles.cameraTriangle2}
                                            />
                                        </View>
                                        <View>
                                            <View
                                                animationType="fade"
                                                transparent={true}
                                                style={
                                                    !this.isIOS &&
                                                    tutorialParams.reportOnboarding &&
                                                    tutorialParams.tips &&
                                                    this.state
                                                        .isCameraTipVisible &&
                                                    !(
                                                        tutorialParams.thumbnailOnboarding &&
                                                        image
                                                    )
                                                        ? styles.cameraLocationAndroid
                                                        : styles.locationHidden
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.tipBubbleSquare
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.mainTipText
                                                        }
                                                    >
                                                        If you wish to take a
                                                        photo or video to add to
                                                        the report, press the
                                                        "Camera” button. If you
                                                        would prefer to select
                                                        one from the gallery,
                                                        press “Gallery”.
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this._isMounted &&
                                                                this.setState({
                                                                    isCameraTipVisible: false,
                                                                    isMapTipVisible: true
                                                                });
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.continue
                                                            }
                                                        >
                                                            Continue
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this._isMounted &&
                                                                this.setState({
                                                                    isCameraTipVisible: false
                                                                });
                                                            this.stopTips();
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.stopTips
                                                            }
                                                        >
                                                            Stop showing tips
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={
                                                        styles.cameraTriangle1
                                                    }
                                                />
                                                <View
                                                    style={
                                                        styles.cameraTriangle2
                                                    }
                                                />
                                            </View>
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
                                                    if (
                                                        this.state
                                                            .hasCameraPermission
                                                    ) {
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
                                                        Platform.OS === "ios"
                                                            ? "ios"
                                                            : "md"
                                                    }-camera`}
                                                    style={styles.btnTextWhite}
                                                />
                                                <Text
                                                    style={styles.btnTextWhite}
                                                >
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
                                                        Platform.OS === "ios"
                                                            ? "ios"
                                                            : "md"
                                                    }-image`}
                                                    style={styles.btnTextWhite}
                                                />
                                                <Text
                                                    style={styles.btnTextWhite}
                                                >
                                                    Gallery
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state.isMapTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.mapLocationIOS
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View
                                                style={styles.tipBubbleSmallest}
                                            >
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    To mark the location of the
                                                    incident, press the “Mark
                                                    location” button.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isMapTipVisible: false,
                                                                isSubmissionTipVisible: true
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isMapTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.mapTriangle} />
                                        </View>
                                        <View>
                                            <View
                                                animationType="fade"
                                                transparent={true}
                                                style={
                                                    !this.isIOS &&
                                                    tutorialParams.reportOnboarding &&
                                                    tutorialParams.tips &&
                                                    this.state
                                                        .isMapTipVisible &&
                                                    !(
                                                        tutorialParams.thumbnailOnboarding &&
                                                        image
                                                    )
                                                        ? styles.mapLocationAndroid
                                                        : styles.locationHidden
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.tipBubbleSmallest
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.mainTipText
                                                        }
                                                    >
                                                        To mark the location of
                                                        the incident, press the
                                                        “Mark on Map” button.
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this._isMounted &&
                                                                this.setState({
                                                                    isMapTipVisible: false,
                                                                    isSubmissionTipVisible: true
                                                                });
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.continue
                                                            }
                                                        >
                                                            Continue
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this._isMounted &&
                                                                this.setState({
                                                                    isMapTipVisible: false
                                                                });
                                                            this.stopTips();
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.stopTips
                                                            }
                                                        >
                                                            Stop showing tips
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={styles.mapTriangle}
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.reportBtnFull}
                                            onPress={() => {
                                                if (
                                                    this.state
                                                        .hasLocationPermission
                                                ) {
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
                                                    Platform.OS === "ios"
                                                        ? "ios"
                                                        : "md"
                                                }-pin`}
                                                style={styles.btnTextWhite}
                                            />
                                            <Text style={styles.btnTextWhite}>
                                                Mark on Map
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        animationType="fade"
                                        transparent={true}
                                        style={
                                            this.isIOS &&
                                            tutorialParams.reportOnboarding &&
                                            tutorialParams.tips &&
                                            this.state.isSubmissionTipVisible &&
                                            !(
                                                tutorialParams.thumbnailOnboarding &&
                                                image
                                            )
                                                ? styles.submissionLocationIOS
                                                : styles.locationHidden
                                        }
                                    >
                                        <View style={styles.tipBubbleBig}>
                                            <Text style={styles.mainTipText}>
                                                Press the “submit” button to
                                                test report submission (recall
                                                that it will not actually be
                                                sent while in tour mode), or
                                                “cancel” to erase the test
                                                report.
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this._isMounted &&
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
                                                    this._isMounted &&
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
                                        <View
                                            style={styles.submissionTriangle1}
                                        />
                                        <View
                                            style={styles.submissionTriangle2}
                                        />
                                    </View>
                                    <View>
                                        <View
                                            animationType="fade"
                                            transparent={true}
                                            style={
                                                !this.isIOS &&
                                                tutorialParams.reportOnboarding &&
                                                tutorialParams.tips &&
                                                this.state
                                                    .isSubmissionTipVisible &&
                                                !(
                                                    tutorialParams.thumbnailOnboarding &&
                                                    image
                                                )
                                                    ? styles.submissionLocationAndroid
                                                    : styles.locationHidden
                                            }
                                        >
                                            <View style={styles.tipBubbleBig}>
                                                <Text
                                                    style={styles.mainTipText}
                                                >
                                                    Press the “submit” button to
                                                    test report submission
                                                    (recall that it will not
                                                    actually be sent while in
                                                    tour mode), or “cancel” to
                                                    erase the test report.
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSubmissionTipVisible: false
                                                            });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.continue}
                                                    >
                                                        Continue
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._isMounted &&
                                                            this.setState({
                                                                isSubmissionTipVisible: false
                                                            });
                                                        this.stopTips();
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.stopTips}
                                                    >
                                                        Stop showing tips
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={
                                                    styles.submissionTriangle1
                                                }
                                            />
                                            <View
                                                style={
                                                    styles.submissionTriangle2
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* REPORT STYLING: SUMMARY */}
                            <View style={styles.container}>
                                <View style={styles.reportContainer}>
                                    <View style={styles.reportSubcontainer}>
                                        <Text
                                            style={{
                                                alignSelf: "center",
                                                fontSize: 30
                                            }}
                                        >
                                            Summary
                                        </Text>
                                        <ScrollView
                                            style={{
                                                flex: 1,
                                                margin: 2,
                                                paddingHorizontal: 5,
                                                borderLeftWidth: 2,
                                                borderRightWidth: 2,
                                                borderColor: "#CCC"
                                            }}
                                        >
                                            <Text style={styles.summaryHeader}>
                                                Incident Category:
                                            </Text>
                                            <Text style={styles.textInput}>
                                                {this.state.incidentCategory}
                                            </Text>

                                            <Text style={styles.summaryHeader}>
                                                Incident Description:
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.textInput,
                                                    {
                                                        height: Math.min(
                                                            120,
                                                            Math.max(
                                                                35,
                                                                this.state
                                                                    .IncDescheight
                                                            )
                                                        )
                                                    }
                                                ]}
                                            >
                                                {this.state.incidentDesc}
                                            </Text>
                                            <Text style={styles.summaryHeader}>
                                                Location Description:
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.textInput,
                                                    {
                                                        height: Math.min(
                                                            120,
                                                            Math.max(
                                                                35,
                                                                this.state
                                                                    .LocDescheight
                                                            )
                                                        )
                                                    }
                                                ]}
                                            >
                                                {
                                                    this.state
                                                        .incidentLocationDesc
                                                }
                                            </Text>
                                        </ScrollView>
                                        {image && (
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: "column",
                                                    justifyContent:
                                                        "space-between"
                                                }}
                                            >
                                                <Text
                                                    style={styles.summaryHeader}
                                                >
                                                    Optional Attachments:
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.reportBtnImg}
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
                                        )}
                                        {/* Button that allows report to be sent */}
                                        <TouchableOpacity
                                            style={styles.reportBtnSubmit}
                                            onPress={() => {
                                                if (
                                                    this.state
                                                        .incidentCategory == ""
                                                ) {
                                                    Alert.alert(
                                                        "Incomplete Report",
                                                        "Please select an incident type.",
                                                        [
                                                            {
                                                                text:
                                                                    "Back to edit",
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
                                                } else if (
                                                    this.state.incidentDesc ==
                                                    ""
                                                ) {
                                                    Alert.alert(
                                                        "Incomplete Report",
                                                        "Please provide a description of the incident.",
                                                        [
                                                            {
                                                                text:
                                                                    "Back to edit",
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
                                                } else if (
                                                    this.state
                                                        .incidentLocationDesc ==
                                                    ""
                                                ) {
                                                    Alert.alert(
                                                        "Incomplete Report",
                                                        "Please provide a description of the incident location.",
                                                        [
                                                            {
                                                                text:
                                                                    "Back to edit",
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
                                                } else if (
                                                    this.state
                                                        .incidentLatitude ==
                                                    null
                                                ) {
                                                    Alert.alert(
                                                        "Incomplete Report",
                                                        "Please mark the location of the incident on the map.",
                                                        [
                                                            {
                                                                text:
                                                                    "Back to edit",
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
                                                } else if (
                                                    this.state
                                                        .incidentLongitude !=
                                                    null
                                                ) {
                                                    Alert.alert(
                                                        "Incomplete Report",
                                                        "Please mark the location of the incident on the map.",
                                                        [
                                                            {
                                                                text:
                                                                    "Back to edit",
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
                                                } else {
                                                    this.handleSubmit();
                                                }
                                            }}
                                        >
                                            <Icon
                                                name={`${
                                                    Platform.OS === "ios"
                                                        ? "ios"
                                                        : "md"
                                                }-send`}
                                                style={styles.btnTextWhite}
                                            />
                                            <Text style={styles.btnTextWhite}>
                                                Submit
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Swiper>
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
                    {/* iOS picker Modal*/}
                    {/*
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
                    </Modal>*/}
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
            </Root>
        );
    }
}

export default ReportScreen;
