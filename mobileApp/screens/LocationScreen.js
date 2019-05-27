import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    AsyncStorage,
    AppState,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from "react-native";
import GeoFencing from "react-native-geo-fencing";
import {
    Container,
    Header,
    Footer,
    Left,
    Right,
    Body,
    Icon,
    Toast
} from "native-base";
import { Permissions, Location, MapView } from "expo";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

const LATITUDE = 36.9916;
const LONGITUDE = -122.0583;

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

class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        pre_report: null,
        region: null,
        appState: AppState.currentState,
        marginBottom: 1
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
        console.log("getUnsubReport");
        console.log(pre_report);
        this._isMounted = true;
        this.setState({
            pre_report: pre_report
        });
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

    async inGeofence(loc) {
        console.log("loc = " + loc);
        for (polygon in geofence) {
            if (await GeoFencing.containsLocation(loc, polygon)) {
                console.log("geofence true");
                return true;
            }
        }
        console.log("geofence false");
        return false;
    }

    componentDidMount() {
        this._isMounted = false;
        this.setState({
            pre_report: null
        });
        this.getUnsubReport();
    }

    componentWillUnmount() {
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
                            name={`${Platform.OS === "ios" ? "ios" : "md"}-pin`}
                            style={{
                                zIndex: 3,
                                position: "absolute",
                                marginTop: -26,
                                marginLeft: -9,
                                left: "50%",
                                top: "50%",
                                color: "red"
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
                                latitude: this.state.pre_report
                                    .incidentLatitude,
                                longitude: this.state.pre_report
                                    .incidentLongitude,
                                latitudeDelta: 0.0461,
                                longitudeDelta: 0.021
                            }}
                            onRegionChangeComplete={region => {
                                console.log("On region change complete");
                                if (this._isMounted) {
                                    // geofencing!
                                    this.setState({ region: region });
                                }
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                backgroundColor: "transparenb",
                                padding: 10,
                                top: "84%"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#ffffffc0",
                                    alignItems: "center",
                                    borderWidth: 0.2,
                                    borderColor: "#00000050",
                                    width: 50,
                                    height: 50,
                                    padding: 5
                                }}
                                onPress={() => {
                                    var pre_report = this.state.pre_report;
                                    pre_report.incidentLatitude = this.state.region.latitude;
                                    pre_report.incidentLongitude = this.state.region.longitude;
                                    pre_report.unchangedLocation = false;
                                    this._isMounted &&
                                        this.setState({
                                            pre_report: pre_report
                                        });
                                    goBack();
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-checkmark`}
                                    style={{
                                        fontSize: 40,
                                        color: "#00b000"
                                    }}
                                />
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
        );
    }
}

export default LocationScreen;
