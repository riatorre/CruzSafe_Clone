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
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <Swiper
          loop={false}
          ref={swiper => {
            this.swiper = swiper;
          }}
        >
          <View style={[styles.slideOuterContainer, styles.slideblue]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                Welcome to CruzSafe! Thank you for downloading our app. You are
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
          {/* <View style={[styles.slideOuterContainer, styles.slidetan]}>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                Have you seen non-emergency issues on campus
                                which cause inconvenience or a safety hazard?
                                Perhaps a hallway with inadequate lighting, a
                                broken window, or a road partially blocked by
                                trash?
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/building.jpg")}
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
                                Some cities have a number to call for such
                                issues, often 211, but many do not. The CruzSafe
                                app was created as a way to address this
                                oversight by giving students a way to text
                                reports of non-emergency issues on campus.
                            </Text>
                        </View>
                        <View style={[styles.slideImageContainer]}>
                            <Image
                                source={require("../assets/images/call211.png")}
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
                    </View> */}
          <View style={[styles.slideOuterContainer, styles.slideblue]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                Before you report an issue, it's important to stop and think
                about the urgency of the situation. We have created buttons
                corresponding to the level of urgency of situations you may
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

          <View style={[styles.slideOuterContainer, styles.slidered]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                If there is an imminent threat to life or property, it is
                important to quickly call 911. For example:
              </Text>
              <Text />
              <Text />
              <Text style={styles.slideText4}>
                A fire, even if it is still small
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                A medical emergency (difficulty breathing, chest pain, fainting,
                severe bleeding, etc)
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                A crime in progress or imminently possible crime (eg. assault,
                burglary, suspicious person)
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                A car crash, particularly if at higher speeds or someone feels
                dizzy/unwell
              </Text>
              <Text />

              <Text style={styles.slideText4}>
                You can contact emergency services through our app by pressing
                the red "emergency" button.
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
          {/* <View style={[styles.slideOuterContainer, styles.slidered]}>
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                If you press the red stoplight button, CruzSafe
                                will ask you to confirm that you wish to call
                                911 through your phone app.
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
                    </View> */}
          <View style={[styles.slideOuterContainer, styles.slideyellow]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                If you become aware of a completed crime or an urgent problem on
                campus that does not merit a call to emergency services, it is
                still NOT appropriate to report it through this app.
              </Text>
            </View>

            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                Responses to reports from this app can take 24 hours or more and
                the reporting system is not designed to handle crimes.Instead,
                please press the yellow "urgent" button to call the UC Santa
                Cruz non-emergency dispatch at
              </Text>
            </View>

            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>(831) 459-2231.</Text>
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
          <View style={[styles.slideOuterContainer, styles.slideyellow]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                Examples of non-emergency situations where you should call
                dispatch include:
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                Property crimes such as theft or vandalism where no evidence,
                witnesses, or suspects are known
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                A minor car crash in which there is motor damage but you are
                certain no one has been hurt and the crash does not present a
                danger to other drivers
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                Illegally parked or abandoned vehicles
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                Questions for the police that are not related to an emergency
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
          {/* <View
                        style={[styles.slideOuterContainer, styles.slideyellow]}
                    >
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                If you press the yellow stoplight button,
                                CruzSafe will ask you to confirm that you wish
                                to call the police non-emergency number.
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
                    </View> */}
          <View style={[styles.slideOuterContainer, styles.slidegreen]}>
            <View style={[styles.slideTextContainerTutorial]}>
              <Text style={styles.slideText4}>
                If there is an issue on campus which is neither very urgent nor
                likely to be connected to a crime, it is appropriate to submit a
                report. Examples of such situations include:
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                Inadequate or broken lighting
              </Text>
              <Text />
              <Text style={styles.slideText4}>Tripping hazards</Text>
              <Text />
              <Text style={styles.slideText4}>A water leak</Text>
              <Text />
              <Text style={styles.slideText4}>
                A broken window, door, or lock
              </Text>
              <Text />
              <Text style={styles.slideText4}>
                To get started, exit the tutorial and press the green report
                button.
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

          {/* <View
                        style={[styles.slideOuterContainer, styles.slidegreen]}
                    >
                        <View style={[styles.slideTextContainer]}>
                            <Text style={styles.slideText}>
                                To get started, exit the tutorial and press the
                                green report button.
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
                    </View> */}
        </Swiper>
      </SafeAreaView>
    );
  }
}
