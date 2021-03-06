import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    AsyncStorage,
    AppState,
    Alert,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
//import GeoFencing from "react-native-geo-fencing";
import {
    Container,
    Header,
    Footer,
    Left,
    Right,
    Body,
    Icon,
    Toast,
    Root
} from "native-base";
import { Permissions, Location, MapView } from "expo";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

const LATITUDE = 36.9916;
const LONGITUDE = -122.0583;

const mainCampusPolygon = [
    { lat: 36.9973, lng: -122.071065 },
    { lat: 37.003264, lng: -122.067803 },
    { lat: 37.004941, lng: -122.060606 },
    { lat: 37.002577, lng: -122.050079 },
    { lat: 36.983451, lng: -122.046994 },
    { lat: 36.979636, lng: -122.0475 }, //new
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

var lastRegion = null;
var wasInGeofence = true;
var intervalId = null;

class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        pre_report: null,
        region: null,
        appState: AppState.currentState,
        marginBottom: 1,
        pinColor: "red"
    };

    async storeItem(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error.message);
        }
    }

    // Gets unsubmitted report that is stored in AsyncStorage
    // Should allows for ease of transfer between screens
    async getUnsubReport() {
        var pre_report = JSON.parse(await AsyncStorage.getItem("unsub_report"));
        this._isMounted = true;
        await this.setState({
            pre_report: pre_report
        });
        await this.getLocationPermission();
    }

    sendAlert(loc) {
        Alert.alert(
            "Current Location",
            "Are you at the location of the incident?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        pre_report.incidentLatitude = loc.coords.latitude;
                        pre_report.incidentLongitude = loc.coords.longitude;
                        this._isMounted &&
                            this.setState({
                                pre_report: pre_report
                            });
                        this.storeUnsubReport(pre_report).then(() => {
                            this.props.navigation.navigate("Report");
                        });
                    }
                },
                {
                    text: "No",
                    onPress: () => {}
                }
            ],
            { cancelable: false }
        );
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
                // if (await this.inGeofence(loc)) {
                // pre_report.incidentLatitude = loc.coords.latitude;
                // pre_report.incidentLongitude = loc.coords.longitude;
                // this._isMounted &&
                //     this.setState({
                //         pre_report: pre_report
                //     });
                // this.storeUnsubReport(pre_report);
                if (
                    this.inGeofence({
                        lat: loc.coords.latitude,
                        lng: loc.coords.longitude
                    })
                ) {
                    this.sendAlert(loc);
                } else {
                    Toast.show({
                        text:
                            "Your current location is not on campus. Please mark the campus location of the incident you wish to report.",
                        duration: 6000
                    });
                }
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

    checkGeofence(region) {
        if (lastRegion == region) return;
        lastRegion = region;
        var inside = this.inGeofence({
            lat: region.latitude,
            lng: region.longitude
        });
        if (inside != wasInGeofence) {
            wasInGeofence = inside;
            if (inside) {
                this.setState({ pinColor: "red" });
            } else {
                this.setState({ pinColor: "indigo" });
                Toast.show({
                    text:
                        "You have exited the bounds of campus. Please move the marker back to a campus region.",
                    duration: 5000
                });
            }
        }
    }

    inGeofence(location) {
        // location = { lat: LATITUDE, lng: LONGITUDE };
        for (i in geofence) {
            // if (await GeoFencing.containsLocation(location, geofence[i])) {
            if (this.ourContainsLocation(location, geofence[i])) {
                return true;
            }
        }
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
                inside = !inside;
            }
        }
        return inside;
    }

    componentDidMount() {
        this._isMounted = false;
        this.setState({
            pre_report: null
        });
        this.getUnsubReport();
    }

    componentWillUnmount() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        const { params } = this.props.navigation.state;
        this._isMounted = false;
        this.storeUnsubReport(this.state.pre_report);
        params.callBack();
    }

    async _onMapReady() {
        const { status, permissions } = await Permissions.askAsync(
            Permissions.LOCATION
        );
        this.setState({ marginBottom: 0 });
    }

    render() {
        if (!(this._isMounted && this.state.pre_report)) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        }
        const { goBack } = this.props.navigation;
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
                                        goBack();
                                    }}
                                />
                            </Left>
                            <Body>
                                <Text style={styles.header_text}>Location</Text>
                            </Body>
                            <Right />
                        </Header>
                        <View
                            style={{
                                flex: 1,
                                paddingTop: this.state.statusBarHeight
                            }}
                        >
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-pin`}
                                style={{
                                    zIndex: 3,
                                    position: "absolute",
                                    marginTop: -26,
                                    marginLeft: -9,
                                    left: "50%",
                                    top: "50%",
                                    color: this.state.pinColor
                                }}
                                size={40}
                                color="#f00"
                            />
                            <MapView
                                style={{
                                    flex: 1,
                                    marginBottom: this.state.marginBottom
                                }}
                                onMapReady={() => {
                                    this._onMapReady();
                                }}
                                showsMyLocationButton={true}
                                showsUserLocation={true}
                                zoomControlEnabled={true}
                                initialRegion={{
                                    latitude:
                                        this.state.pre_report
                                            .incidentLatitude || LATITUDE,
                                    longitude:
                                        this.state.pre_report
                                            .incidentLongitude || LONGITUDE,
                                    latitudeDelta: 0.0461,
                                    longitudeDelta: 0.021
                                }}
                                onRegionChangeComplete={region => {
                                    if (this._isMounted) {
                                        // geofencing!
                                        this.setState({ region: region });
                                        this.checkGeofence(region);
                                    }
                                }}
                            >
                                {/* //Code to print out the geofence boundaries. Do not remove.
                                {mainCampusPolygon.map(
                                    ({ lat, lng }, index) => {
                                        return (
                                            <MapView.Marker
                                                coordinate={{
                                                    latitude: lat,
                                                    longitude: lng
                                                }}
                                            />
                                        );
                                    }
                                )}
                                {coastalCampusPolygon.map(
                                    ({ lat, lng }, index) => {
                                        return (
                                            <MapView.Marker
                                                coordinate={{
                                                    latitude: lat,
                                                    longitude: lng
                                                }}
                                            />
                                        );
                                    }
                                )} */}
                            </MapView>
                            <View
                                style={{
                                    position: "absolute",
                                    backgroundColor: "transparenb",
                                    padding: 0,
                                    bottom: "3%",
                                    left: "39%"
                                }}
                            >
                                <TouchableOpacity
                                    // style={{
                                    //     backgroundColor: "#ffffffc0",
                                    //     alignItems: "center",
                                    //     borderWidth: 0.2,
                                    //     borderColor: "#00000050",
                                    //     width: 100,
                                    //     height: 50,
                                    //     padding: 5
                                    // }}
                                    style={styles.locbtn}
                                    onPress={async () => {
                                        var pre_report = this.state.pre_report;
                                        if (
                                            this.inGeofence({
                                                lat: this.state.region.latitude,
                                                lng: this.state.region.longitude
                                            })
                                        ) {
                                            console.log("In geofence");
                                            console.log(this._isMounted);
                                            console.log(
                                                this.state.region.latitude
                                            );
                                            console.log(
                                                this.state.region.longitude
                                            );
                                            pre_report.incidentLatitude = this.state.region.latitude;
                                            pre_report.incidentLongitude = this.state.region.longitude;
                                            pre_report.unchangedLocation = false;
                                            this._isMounted &&
                                                this.setState({
                                                    pre_report: pre_report
                                                });
                                            await this.storeUnsubReport(
                                                pre_report
                                            );
                                            this.props.navigation.navigate(
                                                "Report"
                                            );
                                        } else {
                                            Alert.alert(
                                                "Off Campus",
                                                "Please select a region on the UCSC main campus or coastal sciences.",
                                                [
                                                    {
                                                        text: "OK",
                                                        onPress: () => {}
                                                    }
                                                ],
                                                { cancelable: false }
                                            );
                                        }
                                    }}
                                >
                                    {/* <Icon
                                        name={`${
                                            Platform.OS === "ios" ? "ios" : "md"
                                        }-checkmark`}
                                        style={{
                                            fontSize: 40,
                                            color: "#00b000",
                                            text: "Mark current location"
                                        }}
                                    /> */}
                                    <Text style={styles.markLocation}>
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
            </Root>
        );
    }
}

export default LocationScreen;
