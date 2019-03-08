import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";

import styles from "../components/styles.js";

export default class Screen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
        >
          <View style={[styles.slideContainer, styles.slide1]}>
            <Image
              source={require("../assets/images/building.jpg")}
              style={{
                width: 300,
                height: 400
              }}
            />
            <Text>
              Have you witnessed non-emergency issues on campus which cause
              inconvenience or a safety hazard? Perhaps a hallway with
              inadequate lighting, a broken window, or a road partially blocked
              by trash?
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide2]}>
            <Text>
              [call 211 image] Some cities have a number to call for such
              issues, often 211, but many do not, particularly on college
              campuses. The CruzSafe app was created as a way to address this
              oversight by giving students a way to text reports of
              non-emergency issues on campus.
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide3]}>
            <Image
              source={require("../assets/images/StopLight.jpg")}
              style={{
                width: 130,
                height: 400
              }}
            />
            <Text>
              Before you report an issue, it's important to stop and think about
              the urgency of the situation. We have created buttons
              corresponding to the level of urgency of situations you may
              encounter. [stoplight image on side]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide4]}>
            <Text>
              If there is an imminent threat to life or property, it is
              important to quickly call 911. Examples of such situations
              include:
            </Text>
            <Text>- A fire, even if it is still small</Text>
            <Text>
              - A medical emergency, such as difficulty speaking or breathing,
              chest pain, fainting, numbness, poisoning, heavy bleeding, sudden
              intense pain, severe burns, or suicidality
            </Text>
            <Text>
              - A crime in progress or imminently possible crime, such as an
              assault, burglary, or a suspicious person lurking
            </Text>
            <Text>
              - A car crash, particularly if it is at higher speeds or someone
              feels dizzy or unwell [stoplight on red]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide5]}>
            <Image
              source={require("../assets/images/Emergency.jpg")}
              style={{
                width: 300,
                height: 600
              }}
            />
            <Text>
              If you press the red stoplight button, CruzSafe will ask you to
              confirm that you wish to call 911 through your phone app.
              [stoplight on red]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide6]}>
            <Image
              source={require("../assets/images/Urgent.jpg")}
              style={{
                width: 300,
                height: 600
              }}
            />
            <Text>
              If you become aware of a completed crime or an urgent problem on
              campus that not merit a call to emergency services, it is still
              not appropriate to report it through this app. Responses to
              reports from this app can take 24 hours or more and the reporting
              system is not designed to handle crimes. Instead, please call the
              UC Santa Cruz non-emergency dispatch at (831) 459-2231. [stoplight
              on yellow]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide7]}>
            <Text>
              Examples of non-emergency situations where you should call
              dispatch include:
            </Text>
            <Text>
              -Property crimes such as theft or vandalism where no evidence,
              witnesses, or suspects are known
            </Text>
            <Text>
              -A minor car crash in which there is motor damage but you are
              certain no one has been hurt and the crash does not present a
              danger to other drivers
            </Text>
            <Text>-Illegal parking or abandoned vehicles</Text>
            <Text>-Non-emergency related questions for the police</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide8]}>
            <Image
              source={require("../assets/images/Report.jpg")}
              style={{
                width: 300,
                height: 600
              }}
            />
            <Text>
              If you press the yellow stoplight button, CruzSafe will ask you to
              confirm that you wish to call the police non-emergency number.
              [stoplight on yellow]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide9]}>
            <Text>
              If there is an issue on campus which is neither very urgent nor
              likely to be connected to a crime, it is appropriate to submit a
              report. Examples of such situations include:
            </Text>
            <Text>-Inadequate or broken lighting</Text>
            <Text>-Tripping hazards</Text>
            <Text>-A water leak</Text>
            <Text>-A broken window, door, or lock</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.swiper.scrollBy(1);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.slideContainer, styles.slide10]}>
            <Text>
              If you press the green stoplight button, CruzSafe will direct you
              to make a report. [stoplight on green]
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.props.navigation.navigate("Home");
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "gray"
                }}
              >
                Exit
              </Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
    );
  }
}
