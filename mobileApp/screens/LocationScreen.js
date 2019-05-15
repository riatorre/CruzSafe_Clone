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
    Icon
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

/* locations with latitude: 
    this.state.latitude                                 -- is this used?
    this.pre_report.incidentLatitude                    -- available copy of incident location
    AsyncStorage "unsub_report" incidentLatitude        -- current reports incident location
    MapView.region                                      -- for us
    MapView.initialRegion                               -- set from ?????

    Flow:
        render
        componentDidMount
            getUnsubReport
*/

class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        location: null,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: null,
        longitudeDelta: null,
        c_latDel: null,
        c_lngDel: null,
        unchangedLocation: true,
        pre_report: null,
        appState: AppState.currentState,
        isLoading: true,
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
        this._isMounted &&
            this.setState({
                latitude: parseFloat(pre_report.incidentLatitude),
                longitude: parseFloat(pre_report.incidentLongitude),
                unchangedLocation: pre_report.unchangedLocation,
                pre_report: pre_report,
                isLoading: false
            });
    }

    // Stores unsubmitted report into AsyncStorage
    // Used to allow easier transfer of data
    async storeUnsubReport(report) {
        try {
            console.log("LocationScreen.storeUnsubReport");
            console.log(report);
            await AsyncStorage.setItem("unsub_report", JSON.stringify(report));
        } catch (error) {
            console.log(error.message);
        }
    }

    async inGeofence(loc) {
        for (polygon in geofence) {
            if (await GeoFencing.containsLocation(loc, polygon)) {
                return true;
            }
        }
        return false;
    }

    async getLocation() {
        try {
            if (this.state.unchangedLocation && !this.state.isLoading) {
                var pre_report = this.state.pre_report;
                const loc = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                if (await inGeofence(loc)) {
                    console.log("inGeofence");
                    pre_report.incidentLatitude = loc.coords.latitude;
                    pre_report.incidentLongitude = loc.coords.longitude;
                    pre_report.unchangedLocation = true;
                    this._isMounted &&
                        this.setState({
                            location: loc,
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude,
                            pre_report: pre_report
                        });
                    this.storeUnsubReport(pre_report);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
        console.log(this.state);
        this.getUnsubReport().then(() => {
            console.log("componentDidMount after getUnsubReport");
            console.log(this.state);
            if (this.state == null || this.state.latitude == null)
                this.getLocation();
        });
        this._isMounted = true;
    }

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        this._isMounted = false;
        this.storeUnsubReport(this.state.pre_report);
        params.callBack();
    }

    setToinit() {
        console.log("setToInit");
        return {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
        };
    }

    async _onMapReady() {
        const { status, permissions } = await Permissions.askAsync(
            Permissions.LOCATION
        );
        this.setState({ marginBottom: 0 });
    }

    render() {
        if (!this._isMounted) {
            console.log("Render: not mounted");
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        }
        console.log("render");
        console.log(this.state);
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
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.0461,
                                longitudeDelta: 0.021
                            }}
                            onRegionChangeComplete={region => {
                                console.log("onRegionChangeComplete");
                                console.log(this.state.pre_report);
                                console.log(region);
                                var pre_report = this.state.pre_report;
                                pre_report.incidentLatitude = region.latitude;
                                pre_report.incidentLongitude = region.longitude;
                                pre_report.unchangedLocation = false;
                                this._isMounted &&
                                    this.setState({
                                        c_latDel: region.latitudeDelta,
                                        c_lngDel: region.longitudeDelta,
                                        unchangedLocation: false,
                                        pre_report: pre_report
                                    });
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
