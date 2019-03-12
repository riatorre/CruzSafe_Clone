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

// Temporary Definition of tagsList; should move to somewhere more global in scale
var tagsList = [
    "Trash",
    "Water Leak",
    "Broken Light",
    "Broken Window",
    "Lighting deficiency",
    "UNDEFINED"
];

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
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-journal`}
                style={{ fontSize: 24, color: tintColor }}
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
                TSArray[1],
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
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ color: "white" }}>
                                        Report #{item.reportID}
                                        {/*Incident #{item.incidentID}*/}
                                    </Text>
                                    <Text
                                        style={{
                                            marginLeft: "auto",
                                            color: "white"
                                        }}
                                    >
                                        {tagsList[item.tag]}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ color: "white" }}>
                                        Created on:{" "}
                                        {this.splitTS(item.reportTS)}
                                    </Text>
                                    {item.completeTS !== null ? (
                                        <Text style={{ color: "white" }}>
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
                    <View style={styles.itemContainer}>
                        <Text>
                            No reports are available at this time. Please try
                            again later.
                        </Text>
                    </View>
                );
            }
        } else {
            return (
                <View style={styles.itemContainer}>
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
        console.log(this.state.messages);
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
    componentDidMount() {
        this.getReports();
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
                                width: "90%",
                                height: "85%",
                                backgroundColor: "#FFFFFF80",
                                padding: 10
                            }}
                        >
                            {/* List of all Reports are here */}
                            <View
                                style={
                                    ({ height: "50%" }, styles.itemContainer)
                                }
                            >
                                <Text style={{ fontSize: 24, margin: 5 }}>
                                    Reports under Review:
                                </Text>
                                {this.MyFlatList(this.state.incompleteReports)}
                            </View>
                            <View
                                style={
                                    ({ height: "50%" }, styles.itemContainer)
                                }
                            >
                                <Text style={{ fontSize: 24, margin: 5 }}>
                                    Completed Reports:
                                </Text>
                                {this.MyFlatList(this.state.completeReports)}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                this.getReports();
                                this.getMessages();
                            }}
                        >
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-refresh`}
                                style={{ color: "white" }}
                            />
                            <Text style={{ color: "white" }}>Refresh</Text>
                        </TouchableOpacity>
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
export default History;
