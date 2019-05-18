/*
 * History.js
 * Users history will show here
 */

import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    FlatList,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator,
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

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

// Temporary Definition of tagsList; should move to somewhere more global in scale
var tagsList = [
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting Deficiency",
    "Excess Trash",
    "UNDEFINED"
];

//Initialize tutorialParams. We will later pull the proper parameters.
var tutorialParams = {
    tips: false,
    reportOnboarding: false,
    thumbnailOnboarding: false,
    historyOnboarding: false,
    sidebarOnboarding: false,
    inHistoryOnboarding: false
};

class History extends Component {
    state = {
        data: [],
        completeReports: [],
        incompleteReports: [],
        reportID: [],
        messages: [],
        isLoading: true
    };

    static navigationOptions = {
        //Drawer Icon
        drawerIcon: ({}) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-journal`}
                style={styles.drawerText}
            />
        )
    };

    async runTutorial() {
        await this.getTutorialParams();
        if (
            tutorialParams.historyOnboarding == true &&
            tutorialParams.tips == true &&
            tutorialParams.inHistoryOnboarding == false
        ) {
            tutorialParams.inHistoryOnboarding = true;
            this.setTutorialParams();
            Alert.alert(
                "Note",
                "Once you have submitted reports, they will show up on this page. You can click on a report to see more detailed information.",
                [
                    {
                        text: "Continue",
                        onPress: () => {
                            this.reportAlert();
                        }
                    }
                ]
            );
        }
    }

    reportAlert() {
        console.log(tutorialParams);
        if (
            tutorialParams.historyOnboarding == true &&
            tutorialParams.tips == true
        ) {
            Alert.alert(
                "Handling Reports",
                "Would you like to understand more about what happens after your report is submitted?",
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            this.props.navigation.navigate("HistorySwiper");
                        }
                    },
                    {
                        text: "No",
                        onPress: () => {
                            tutorialParams.inHistoryOnboarding = false;
                            tutorialParams.historyOnboarding = false;
                            this.setTutorialParams();
                        }
                    }
                ]
            );
        }
    }

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

    MyFlatList(list) {
        if (!this.state.isLoading) {
            if (list.length > 0) {
                return (
                    <FlatList
                        data={list} // All data goes here
                        keyExtractor={(item, index) => index.toString()} // Defines how the items are identified
                        renderItem={({ item }) => (
                            //Defining how each element will appear in the list
                            <TouchableOpacity
                                style={styles.reportBtn}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        "ReportDetail",
                                        {
                                            itemId: item.reportID
                                        }
                                    )
                                }
                            >
                                <Text style={styles.btnTextWhite}>
                                    Report #{item.reportID}
                                </Text>
                                <Text style={styles.btnTextWhite}>
                                    Type: {tagsList[item.tag - 1]}
                                </Text>
                                <View>
                                    <Text style={styles.btnTextWhite}>
                                        Created on:{" "}
                                        {this.splitTS(item.reportTS)}
                                    </Text>
                                    {item.completeTS !== null ? (
                                        <Text style={styles.btnTextWhite}>
                                            Completed on:{" "}
                                            {this.splitTS(item.completeTS)}
                                        </Text>
                                    ) : (
                                        <View />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                );
            } else {
                return (
                    <Text>
                        No reports are available at this time. Please try again
                        later.
                    </Text>
                );
            }
        } else {
            return (
                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 0.5,
                        borderColor: "#4488A7",
                        justifyContent: "center",
                        alignContent: "center"
                    }}
                >
                    <ActivityIndicator size="large" color="#303060" />
                </View>
            );
        }
    }

    async getMobileID() {
        try {
            const id = await AsyncStorage.getItem("mobileID");
            this.setState({ mobile: id });
            return id;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getreportID() {
        try {
            const rid = await AsyncStorage.getItem("reportID");
            this.setState({ report: JSON.parse(rid) });
            return rid;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getReports() {
        this.setState({ isLoading: true });
        await fetch("https://cruzsafe.appspot.com/api/reports/userReports", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileID: await this.getMobileID() //Temporary Value of 1; Must be replaced once we integrate Shibboleth
            })
        })
            .then(res => res.json())
            .then(result => {
                this.setState({ data: result, isLoading: false });
                this.storeReports("Reports", JSON.stringify(result));
                ID = [];
                for (var i = 0; i < result.length; i++) {
                    ID.push(JSON.stringify(result[i].reportID));
                }
                this.storeID("reportID", JSON.stringify(ID));
            })
            .catch(err => {
                console.log(err);
            });
    }

    async getMessages() {
        this.setState({ isLoading: true });
        await fetch("https://cruzsafe.appspot.com/api/messages/getMessages", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reportID: JSON.parse(await this.getreportID())
            })
        })
            .then(res => res.json())
            .then(result => {
                this.setState({ messages: result, isLoading: false });
                this.storeMessages("Messages", JSON.stringify(result));
            })
            .catch(err => {
                console.log(err);
            });
    }

    async storeReports(key, report) {
        try {
            await AsyncStorage.setItem(key, report);
        } catch (error) {
            console.log(error.message);
        }
        this.setReports(key);
    }

    async storeMessages(key, message) {
        try {
            await AsyncStorage.setItem(key, message);
        } catch (error) {
            console.log(error.message);
        }
        this.setState({ messages: JSON.parse(message) });
        /*for (var i = 0; i < this.state.messages.length; i++) {
            console.log(this.state.messages[i].messageText);
        }*/
    }

    async storeID(key, ID) {
        try {
            await AsyncStorage.setItem(key, ID);
        } catch (error) {
            console.log(error.message);
        }
        this.setState({ reportID: JSON.parse(ID) });
    }

    async setReports(key) {
        try {
            var cL = [];
            var iL = [];
            var result = JSON.parse(await AsyncStorage.getItem(key));
            for (var i = 0; i < result.length; i++) {
                if (result[i].completeTS != null) {
                    cL.push(result[i]);
                } else {
                    iL.push(result[i]);
                }
            }
            this.setState({
                completeReports: cL,
                incompleteReports: iL
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    //Gets all reports by current user on first load of the page. May occur when app is restarted, or when a new user signs in
    async componentDidMount() {
        await this.getTutorialParams();
        this.getReports();
        this.props.navigation.addListener("didFocus", this._didFocus);
        this.runTutorial();
    }

    _didFocus = nextAppState => {
        this.runTutorial();
    };

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

    render() {
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
                            {/* Center of Header */}
                            <Text style={styles.header_text}>History</Text>
                        </Body>
                        <Right />
                    </Header>
                    {/* Main Body */}
                    <Content contentContainerStyle={styles.container}>
                        <View
                            style={{
                                flex: 0.95,
                                width: "90%",
                                justifyContent: "space-between"
                            }}
                        >
                            {/* List of all Reports are here */}
                            <View style={styles.historyContainer}>
                                <Text style={styles.reportHistoryText}>
                                    Reports Under Review
                                </Text>
                                {this.MyFlatList(this.state.incompleteReports)}
                            </View>
                            <View style={styles.historyContainer}>
                                <Text style={styles.reportHistoryText}>
                                    Completed Reports
                                </Text>
                                {this.MyFlatList(this.state.completeReports)}
                            </View>
                            <TouchableOpacity
                                style={styles.refreshBtn}
                                onPress={() => {
                                    this.getReports();
                                    this.getMessages();
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-refresh`}
                                    style={styles.btnTextWhite}
                                />
                                <Text style={styles.btnTextWhite}>Refresh</Text>
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
export default History;
