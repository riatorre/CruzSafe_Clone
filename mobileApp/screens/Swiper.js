/*
 * Swiper.js
 * A screen that creates a swiper tutorial
 */
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
                    {/* Used different containers to split the page and to add styling */}
                    <View
                        style={[styles.slideOuterContainer, styles.slideblue]}
                    >
                        <View style={[styles.slideTextContainerTutorial]}>
                            <Text style={styles.slideText7}>
                                Welcome to CruzSafe!
                            </Text>
                            <Text />

                            <Text style={styles.slideText4}>
                                Thank you for downloading our app. You are
                                helping make the campus safer for everyone!
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/CruzSafeMain.png")}
                                style={styles.welcomeScreenLogo}
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

                    {/* Used different containers to split the page and to add styling */}
                    <View
                        style={[styles.slideOuterContainer, styles.slideblue]}
                    >
                        <View style={[styles.slideTextContainerTutorial]}>
                            <Text style={styles.slideText7}>
                                Stop and think about the urgency of the
                                situation.
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                We have created buttons corresponding to the
                                level of urgency of situations you may
                                encounter.
                            </Text>
                        </View>

                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/trafic.png")}
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

                    {/* Used different containers to split the page and to add styling */}
                    <View style={[styles.slideOuterContainer, styles.slidered]}>
                        <View style={[styles.slideTextContainerTutorial]}>
                            <Text style={styles.slideText7}>
                                If there is an imminent threat to life or
                                property, it is important to quickly call 911.
                            </Text>

                            <Text />
                            <Text style={styles.slideText4}>
                                A fire, even if it is still small
                            </Text>

                            <Text style={styles.slideText4}>
                                A medical emergency (difficulty breathing, chest
                                pain, fainting, severe bleeding, etc)
                            </Text>

                            <Text style={styles.slideText4}>
                                A crime in progress or imminently possible crime
                                (eg. assault, burglary, suspicious person)
                            </Text>

                            <Text style={styles.slideText4}>
                                A car crash, particularly if at higher speeds or
                                someone feels dizzy/unwell
                            </Text>
                            <Text />

                            <Text style={styles.slideText4}>
                                You can contact emergency services through our
                                app by pressing the red "emergency" button.
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/EmergencyNew.png")}
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

                    {/* Used different containers to split the page and to add styling */}
                    <View
                        style={[styles.slideOuterContainer, styles.slideyellow]}
                    >
                        <View style={[styles.slideTextContainerTutorial]}>
                            <Text style={styles.slideText7}>
                                Even if they are not emergencies, you should
                                still call dispatch rather than using this app
                                for an urgent or crime-related situations,
                            </Text>
                            <Text styles={styles.slideText4}>
                                Some examples include:
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                Property crimes such as theft or vandalism where
                                no evidence, witnesses, or suspects are known
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                A minor car crash in which there is motor damage
                                but you are certain no one has been hurt and the
                                crash does not present a danger to other drivers
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                Illegally parked or abandoned vehicles
                            </Text>

                            <Text style={styles.slideText4}>
                                Questions for the police that are not related to
                                an emergency
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/UrgentNew.png")}
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

                    {/* Used different containers to split the page and to add styling */}
                    <View
                        style={[styles.slideOuterContainer, styles.slidegreen]}
                    >
                        <View style={[styles.slideTextContainerTutorial]}>
                            <Text style={styles.slideText7}>
                                Issue on campus? Neither urgent nor crime,
                                submit a report.
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                Inadequate or broken lighting
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                Tripping hazards
                            </Text>
                            <Text />
                            <Text style={styles.slideText4}>A water leak</Text>
                            <Text />
                            <Text style={styles.slideText4}>
                                A broken window, door, or lock
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/ReportNew.png")}
                                style={{
                                    width: 250,
                                    height: 250
                                }}
                            />
                        </View>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText4}>
                                To get started, exit the tutorial and press the
                                green report button.
                            </Text>
                            <Text />
                        </View>

                        <View style={styles.slideOuterButton}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    this.props.navigation.navigate("Home");
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
}
