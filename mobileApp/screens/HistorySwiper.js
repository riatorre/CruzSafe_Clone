import React from "react";
import {
    SafeAreaView,
    View,
    Image,
    Text,
    AsyncStorage,
    TouchableOpacity,
    StatusBar
} from "react-native";
import Swiper from "react-native-swiper";

import styles from "../components/styles.js";

//Initialize tutorialParams. We will later pull the proper parameters.
var tutorialParams = {
    tips: false,
    reportOnboarding: false,
    thumbnailOnboarding: false,
    historyOnboarding: false,
    sidebarOnboarding: false,
    inHistoryOnboarding: false
};

export default class Screen extends React.Component {
    render() {
        swiper = this;
        return (
            <SafeAreaView
                style={{ flex: 1, marginTop: StatusBar.currentHeight }}
            >
                <Swiper
                    loop={false}
                    ref={swiper => {
                        this.swiper = swiper;
                    }}
                >
                    <View style={[styles.slideOuterContainer, styles.slidetan]}>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                Imagine that you have submitted a report on a
                                broken pipe in McHenry Library. Your report will
                                be automatically forwarded to the correct
                                department. For this example, it would be
                                assigned to Physical Planning and Construction
                                (PPC). Your report is assigned a unique
                                Report/Incident ID and and placed in the
                                “Reports under Review” category on your history
                                page. The Report ID is unique, but the Incident
                                ID can be changed to match other reports of the
                                same issue.
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/pipe.jpg")}
                                style={{
                                    width: 300,
                                    height: 200
                                }}
                            />
                        </View>
                        <View style={styles.slideOuterButton}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    this.swiper.scrollBy(1);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "white"
                                    }}
                                >
                                    Next
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.slideOuterContainer, styles.slidetan]}>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                Your report will be opened by the department,
                                who are emailed a list of all reports assigned
                                to them. For this example of a broken pipe,
                                Physical Planning and Construction will send
                                someone out within a few hours to investigate
                                the leak, as water damage can become severe
                                fairly quickly. They may send you a message that
                                they are working on the problem. If it is after
                                hours, Police Dispatch may be sent out instead
                                to investigate particularly urgent problems.
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/construction.jpg")}
                                style={{
                                    width: 200,
                                    height: 200
                                }}
                            />
                        </View>
                        <View style={styles.slideOuterButton}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    this.swiper.scrollBy(1);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "white"
                                    }}
                                >
                                    Next
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.slideOuterContainer, styles.slidetan]}>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                A worker will then go out to the location of the
                                incident. The worker will confirm the issue and
                                take action, for example by repairing the broken
                                pipe. You will receive a notification when the
                                issue is resolved and it will be moved to the
                                “Completed Reports” category on the history
                                page.
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/pipework.jpg")}
                                style={{
                                    width: 250,
                                    height: 250
                                }}
                            />
                        </View>
                        <View style={styles.slideOuterButton}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    tutorialParams.historyOnboarding = false;
                                    tutorialParams.inHistoryOnboarding = false;
                                    this.setTutorialParams();
                                    this.props.navigation.navigate("History");
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "white"
                                    }}
                                >
                                    Exit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Swiper>
            </SafeAreaView>
        );
    }

    //Gets all reports by current user on first load of the page. May occur when app is restarted, or when a new user signs in
    async componentDidMount() {
        await this.getTutorialParams();
    }

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
            console.log("End of swiper2");
            console.log(tutorialParams);
            this.setState({});
        } catch (error) {
            console.log(error.message);
        }
    }
}
