/*
 * Report.js
 * A screen to display the detail of the report
 */

import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    AsyncStorage,
    ActivityIndicator
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
import { MapView } from "expo";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

const tagsList = [
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting Deficiency",
    "Excess Trash"
];

class ReportDetail extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        report: null,
        isLoading: true
    };

    static navigationOptions = {
        // Drawer Name
        drawerLabel: "Report Detail",
        //Drawer Icon
        drawerIcon: ({}) => (
            <Icon
                name={`${
                    Platform.OS === "ios" ? "ios" : "md"
                }-information-circle-outline`}
                style={styles.DrawerText}
            />
        )
    };

    // Formats the Time component to a user friendly formant; 12 hour
    formatDate(date) {
        var d = new Date(date);
        var hh = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        h = h < 10 ? "0" + h : h;
        var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
        var replace = h + ":" + m;
        //replace += ":" + s;
        replace += " " + dd;
        var edittedTS = date.replace(pattern, replace);
        var GMTRemovePattern = new RegExp("GMT-[0-9]{4} ");
        var finalTS = edittedTS.replace(GMTRemovePattern, "");
        return finalTS;
    }

    // Formats entire DateTime from MySQL to a user friendly format
    splitTS(TS) {
        var TSArray = TS.split(/[-T:.]/);
        var TStemp = new Date(
            Date.UTC(
                TSArray[0],
                TSArray[1] - 1,
                TSArray[2],
                TSArray[3],
                TSArray[4],
                TSArray[5]
            )
        );
        var TSString = TStemp.toString();
        return this.formatDate(TSString);
    }

    async checkAsyncStorage() {
        const itemId = this.props.navigation.getParam("itemId");
        const storedReports = JSON.parse(await AsyncStorage.getItem("Reports"));
        if (storedReports) {
            for (var i = 0; i < storedReports.length; i++) {
                if (storedReports[i].reportID === itemId) {
                    this._isMounted &&
                        this.setState({
                            report: storedReports[i],
                            isLoading: false
                        });
                    return true;
                }
            }
        }
        return false;
    }

    async getReportFromDB() {
        const itemId = this.props.navigation.getParam("itemId");
        await fetch("https://cruzsafe.appspot.com/api/reports/reportID", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: itemId
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result[0].message == null) {
                    this._isMounted &&
                        this.setState({ report: result[0], isLoading: false });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createReport() {
        const { report } = this.state;
        console.log("report: " + report);
        console.log(report.latitude + " " + report.longitude);
        console.log(typeof report.latitude);
        console.log(typeof report.longitude);
        const reportLat = parseFloat(report.latitude);
        const reportLong = parseFloat(report.longitude);
        const latlng = { latitude: reportLat, longitude: reportLong };
        return (
            <View style={styles.reportSingleContainer}>
                <View>
                    <Text
                        style={{
                            fontSize: 20
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>Report ID: </Text>
                        {report.reportID}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            Incident ID:{" "}
                        </Text>
                        {report.incidentID}
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontSize: 20
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>
                                Created on:{" "}
                            </Text>
                            {this.splitTS(report.reportTS)}
                        </Text>
                        {report.completeTS !== null ? (
                            <Text
                                style={{
                                    fontSize: 20
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>
                                    Completed on:{" "}
                                </Text>{" "}
                                {this.splitTS(report.completeTS)}
                            </Text>
                        ) : (
                            <View />
                        )}
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>
                        <Text
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Incident Category:
                        </Text>{" "}
                        {tagsList[report.tag]}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>
                        <Text
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Incident Description:
                        </Text>{" "}
                        {report.body}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 20 }}>
                        <Text
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Description of Location:
                        </Text>{" "}
                        {report.location}
                    </Text>
                </View>
                <MapView
                    style={{ flex: 0.5 }}
                    initialRegion={{
                        latitude: reportLat,
                        longitude: reportLong,
                        latitudeDelta: 0.00461,
                        longitudeDelta: 0.002105
                    }}
                >
                    <MapView.Marker
                        coordinate={latlng}
                        title="Marked Location"
                    />
                </MapView>
            </View>
        );
    }

    async componentDidMount() {
        this._isMounted = true;
        const foundReportInAsync = await this.checkAsyncStorage();
        if (!foundReportInAsync) this.getReportFromDB();
        console.log(this.state.report);
    }

    componentWillUnmount() {
        this._isMounted = false;
        const callBack = this.props.navigation.getParam("callBack", null);
        if (callBack != null) {
            callBack();
        }
    }

    render() {
        const { goBack } = this.props.navigation;
        const itemId = this.props.navigation.getParam("itemId", "NO-ID");
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            {/* Icon used to open Side Drawer */}
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-arrow-back`}
                                style={styles.icon}
                                onPress={() => goBack()}
                            />
                        </Left>
                        <Body>
                            {/* Center of Header */}
                            <Text style={styles.header_text}>
                                Report Detail
                            </Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <Content contentContainerStyle={styles.container}>
                        {this.state.isLoading ? (
                            <ActivityIndicator size="large" color="#303060" />
                        ) : (
                            this.createReport()
                        )}
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
                            {/* Center of Footer */}
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
export default ReportDetail;
