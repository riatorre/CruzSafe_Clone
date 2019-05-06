/*
	Primary screen of the application. 
	Primary components include calling 911, calling non-emergency, and sending a report.
	Secondary components include buttons to lead to supplemental UCSC police info. 
	Also includes navigation to AdditionalInfoScreen, etc.
*/

import React, { Component } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Platform,
    AsyncStorage,
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
import { Permissions, Notifications } from "expo";
import styles from "../components/styles.js";

const LATITUDE = "36.9916";
const LONGITUDE = "-122.0583";
const newPre_report = {
    incidentDesc: "",
    incidentCategory: "",
    incidentLocationDesc: "",
    incidentLatitude: LATITUDE,
    incidentLongitude: LONGITUDE,
    unchangedLocation: true,
    imageURI: null
};

class HomeScreen extends Component {
    async continue() {
        var pre_report = JSON.parse(await AsyncStorage.getItem("unsub_report"));
        if (pre_report == null) {
            pre_report = newPre_report;
            this.storeItem("unsub_report", pre_report);
        }
        if (
            pre_report.incidentCategory !== "" ||
            pre_report.incidentDesc !== "" ||
            pre_report.incidentLocationDesc !== "" ||
            pre_report.imageURI !== null ||
            pre_report.unchangedLocation !== true
        ) {
            Alert.alert(
                "Continue?",
                "We found an unsubmitted report. Do you wish to continue editing?",
                [
                    {
                        text: "Yes, continue editing",
                        onPress: () => {
                            // If the user choose to continue editting previous report,
                            // reset all text states to previous one
                            this.props.navigation.navigate("Report");
                        }
                    },
                    {
                        text: "No, start a new one",
                        onPress: () => {
                            // If the user choose to start a new report,
                            // reset all text states to ""
                            this.storeItem("unsub_report", newPre_report).then(
                                () => {
                                    this.props.navigation.navigate("Report");
                                }
                            );
                        },
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        } else {
            this.props.navigation.navigate("Report");
        }
    }

    //actually launches tutorial
    async launchTutorial() {
        console.log("launching tutorial: ");
        mobileID = await this.getMobileID();
        await fetch("https://cruzsafe.appspot.com/api/users/updateLogin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileID: mobileID
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log("Result has been returned: ");
                console.log(result);
                //this.storeMessages("Messages", JSON.stringify(result));
                console.log("Messages stored: " + result);
                this.props.navigation.navigate("Swiper");
            })
            .catch(err => {
                console.log(err);
            });
    }

    //launch tutorial if user's first login
    async checkLogin() {
        console.log("Checking login for ");
        console.log(await this.getMobileID()); //sometimes returns null?
        await fetch("https://cruzsafe.appspot.com/api/users/checkFirstLogin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileID: await this.getMobileID()
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log("Result = ");
                console.log(result);
                if (
                    result.message === undefined &&
                    result[0].firstLogin === 1
                ) {
                    this.launchTutorial();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // When the user create a report, start detecting previous unsubmitted report
    async handleReport(visible) {
        this.delay = setTimeout(() => {
            this.continue();
        }, 10);
    }

    // store texts in AsyncStorage
    async storeItem(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMobileID() {
        try {
            const id = await AsyncStorage.getItem("mobileID");
            return id;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getNotificationPermission() {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== "granted") {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(
                Permissions.NOTIFICATIONS
            );
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== "granted") {
            return;
        }
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        this.storeItem("token", token);
        await fetch("https://cruzsafe.appspot.com/api/reports/updateToken", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileID: JSON.parse(await this.getMobileID()),
                token: token
            })
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    async componentDidMount() {
        console.log("HS did mount");
        this._isMounted = true;
        await this.checkLogin();
        //await this.askReport();
        this.getNotificationPermission();
    }

    static navigationOptions = {
        drawerLabel: "Home",
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
                style={{ fontSize: 24, color: tintColor }}
            />
        )
    };

    /*
        The Updated Homescreen includes the following elements:
        - Logo
        - Title Text
        - Subtitle Text
        - Traffic Light
        - Traffic Light Buttons x3
        - Tagline Text
        - Various Logos
        - Version Text
    */
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
                            <Text style={styles.header_text}>Home</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        {/* Traffic Light */}
                        <View style={styles.traffic_light}>
                            {/* Emergency Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#f00",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    var url =
                                        (Platform.OS === "ios"
                                            ? "telprompt:"
                                            : "tel:") + "911";
                                    return Linking.canOpenURL(url).then(
                                        canOpen => {
                                            if (canOpen) {
                                                return Linking.openURL(
                                                    url
                                                ).catch(err =>
                                                    Promise.reject(err)
                                                );
                                            } else {
                                                Promise.reject(
                                                    new Error(
                                                        "invalid URL provided: " +
                                                            url
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }}
                            >
                                <Text>Emergency</Text>
                            </TouchableOpacity>

                            {/* Urgent Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#ff0",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    var url =
                                        (Platform.OS === "ios"
                                            ? "telprompt:"
                                            : "tel:") + "8314592231";
                                    return Linking.canOpenURL(url).then(
                                        canOpen => {
                                            if (canOpen) {
                                                return Linking.openURL(
                                                    url
                                                ).catch(err =>
                                                    Promise.reject(err)
                                                );
                                            } else {
                                                Promise.reject(
                                                    new Error(
                                                        "invalid URL provided: " +
                                                            url
                                                    )
                                                );
                                            }
                                        }
                                    );
                                }}
                            >
                                <Text>Urgent</Text>
                            </TouchableOpacity>

                            {/* Report Light */}
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.2)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "#0f0",
                                    borderRadius: 100,
                                    margin: 5
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        "Confirmation",
                                        "Please verify that this report is not an emergency.",
                                        [
                                            {
                                                text:
                                                    "No, it is not an emergency",
                                                // Run when it's not emergency
                                                onPress: () =>
                                                    this.handleReport(true)
                                            },
                                            {
                                                text: "Yes, it is an emergency",
                                                onPress: () => {
                                                    var url =
                                                        (Platform.OS === "ios"
                                                            ? "telprompt:"
                                                            : "tel:") + "911";
                                                    return Linking.canOpenURL(
                                                        url
                                                    ).then(canOpen => {
                                                        if (canOpen) {
                                                            return Linking.openURL(
                                                                url
                                                            ).catch(err =>
                                                                Promise.reject(
                                                                    err
                                                                )
                                                            );
                                                        } else {
                                                            Promise.reject(
                                                                new Error(
                                                                    "invalid URL provided: " +
                                                                        url
                                                                )
                                                            );
                                                        }
                                                    });
                                                },
                                                style: "cancel"
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                <Text>Report</Text>
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
export default HomeScreen;
