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
    AsyncStorage
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
import PropTypes from "prop-types";

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
        incompleteReports: []
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

    MyFlatList(list) {
        if (list.length > 0) {
            return (
                <FlatList
                    data={list} // All data goes here
                    keyExtractor={(item, index) => index.toString()} // Defines how the items are identified
                    renderItem={({ item }) => (
                        //Defining how each element will appear in the list
                        <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() => {
                                console.log(item.reportID);
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <Text>
                                    Report #{item.reportID}
                                    {/*Incident #{item.incidentID}*/}
                                </Text>
                                <Text
                                    style={{
                                        marginLeft: "auto"
                                    }}
                                >
                                    {tagsList[item.tag]}
                                </Text>
                            </View>
                            <View>
                                <Text>Date Created: {item.reportTS}</Text>
                                {item.completeTS !== null ? (
                                    <Text>
                                        Date Completed: {item.completeTS}
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
                        No reports are available at this time. Please try again
                        later
                    </Text>
                </View>
            );
        }
    }

    getReports() {
        fetch("https://cruzsafe.appspot.com/api/reports/userReports", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileID: 1 //Temporary Value of 1; Must be replaced once we integrate Shibboleth
            })
        })
            .then(res => res.json())
            .then(result => {
                var cList = [];
                var iList = [];
                this.setState({ data: result });
                // Stores the result into a state
                for (var i = 0; i < result.length; i++) {
                    if (result[i].completeTS != null) {
                        cList.push(result[i]);
                        this.storeReports(
                            JSON.stringify(result[i].reportID),
                            JSON.stringify(result[i])
                        );
                    } else {
                        iList.push(result[i]);
                        this.storeReports(
                            JSON.stringify(result[i].reportID),
                            JSON.stringify(result[i])
                        );
                    }
                }

                this.setState({
                    completeReports: cList,
                    incompleteReports: iList
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    async storeReports(key, report) {
        try {
            await AsyncStorage.clear();
            await AsyncStorage.setItem(key, report);
        } catch (error) {
            console.log(error.message);
        }
        this.setReports();
    }

    async setReports() {
        try {
            var cl = [];
            var il = [];
            var key = await AsyncStorage.getAllKeys();
            key.sort(function(a, b) {
                return a - b;
            });
            for (var i = 0; i < key.length - 1; i++) {
                var r = JSON.parse(await AsyncStorage.getItem(key[i]));
                if (r.completeTS != null) {
                    cl.push(r);
                } else {
                    il.push(r);
                }
            }
            /*
            this.setState({
                completeReports: cl,
                incompleteReports: il
            });
            */
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
                                this.getReports;
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
