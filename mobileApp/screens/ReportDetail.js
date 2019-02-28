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

import styles from "../components/styles.js";

const tagsList = [
    "Trash",
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting deficiency"
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
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${
                    Platform.OS === "ios" ? "ios" : "md"
                }-information-circle-outline`}
                style={{ fontSize: 24, color: tintColor }}
            />
        )
    };

    async checkAsyncStorage() {
        const itemId = this.props.navigation.getParam("itemId");
        const storedReports = JSON.parse(await AsyncStorage.getItem("Reports"));
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
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <Text>Report ID: {report.reportID}</Text>
                    <Text>Incident #{report.incidentID}</Text>
                </View>
                <Text>Incident Category: {tagsList[report.tag]}</Text>
                <Text>Incident Description: {report.body}</Text>
                <Text>Description of Location: {report.location}</Text>
            </View>
        );
    }

    async componentDidMount() {
        this._isMounted = true;
        const foundReportInAsync = await this.checkAsyncStorage();
        if (!foundReportInAsync) {
            this.getReportFromDB();
        }
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
export default ReportDetail;
