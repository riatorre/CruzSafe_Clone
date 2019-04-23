import React, { Component } from "react";
import {
    View,
    Text,
    Platform,
    AsyncStorage,
    AppState,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import {
    Container,
    Header,
    Footer,
    Left,
    Right,
    Body,
    Icon
} from "native-base";
import { Location, MapView } from "expo";

import styles from "../components/styles.js";

const LATITUDE = "36.9916";
const LONGITUDE = "-122.0583";

class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        location: null,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        unchangedLocation: true,
        pre_report: null,
        appState: AppState.currentState,
        isLoading: true
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
        this._isMounted &&
            this.setState({
                latitude: pre_report.incidentLatitude,
                longitude: pre_report.incidentLongitude,
                unchangedLocation: pre_report.unchangedLocation,
                pre_report: pre_report,
                isLoading: false
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

    async getLocation() {
        try {
            if (this.state.unchangedLocation && !this.state.isLoading) {
                var pre_report = this.state.pre_report;
                const loc = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
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
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUnsubReport().then(() => {
            this.getLocation();
        });
    }

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        this._isMounted = false;
        this.storeUnsubReport(this.state.pre_report);
        params.callBack();
    }

    render() {
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
                    <View style={{ flex: 1 }}>
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
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: parseFloat(this.state.latitude),
                                longitude: parseFloat(this.state.longitude),
                                latitudeDelta: 0.0461,
                                longitudeDelta: 0.021
                            }}
                            onRegionChangeComplete={region => {
                                var pre_report = this.state.pre_report;
                                pre_report.incidentLatitude = region.latitude;
                                pre_report.incidentLongitude = region.longitude;
                                pre_report.unchangedLocation = false;
                                this._isMounted &&
                                    this.setState({
                                        latitude: region.latitude,
                                        longitude: region.longitude,
                                        unchangedLocation: false,
                                        pre_report: pre_report
                                    });
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                padding: 20,
                                backgroundColor: "transparenb",
                                top: "80%"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#00000060",
                                    borderRadius: 54,
                                    alignItems: "center",
                                    width: 54,
                                    height: 54,
                                    padding: 5
                                }}
                                onPress={async () => {
                                    await (this._isMounted &&
                                        this.setState({
                                            unchangedLocation: true
                                        }));
                                    this.getLocation();
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-locate`}
                                    style={{ fontSize: 44, color: "#303060" }}
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
            </SafeAreaView>
        );
    }
}

export default LocationScreen;
