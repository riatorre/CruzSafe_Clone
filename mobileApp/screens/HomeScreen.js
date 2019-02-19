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
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
  Button,
  ScrollView,
  AsyncStorage,
  Alert,
  Picker
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

import SelectableListScene from "./SelectableListScene";

import styles from "../components/styles.js";

function createIncidentTypePicker(props) {
  return (
    <TouchableOpacity
      style={styles.dropdown_menu}
      onPress={() => {
        props.homeScreen.setIOSPickerVisible(true);
      }}
    >
      <Text style={{ marginRight: 5, fontSize: 14 }}>
        {props.homeScreen.state.incidentCategory
          ? props.homeScreen.state.incidentCategory
          : "Select Incident Type"}
      </Text>
      <Icon
        name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-dropdown`}
        style={{ fontSize: 14 }}
      />
    </TouchableOpacity>
  );
}

class HomeScreen extends Component {
  // State that should be used to record Report details & handle Modal Visibility.
  // Add, Update, or Remove entries as needed
  state = {
    reportModalVisible: false,
    cameraModalVisible: false,
    iOSPickerVisible: false,
    locationModalVisible: false,
    incidentCategory: "",
    incidentDesc: "",
    incidentLocationDesc: ""
  };

  setReportModalVisible(visible) {
    this.setState({ reportModalVisible: visible });
  }

  setCameraModalVisible(visible) {
    this.setState({ cameraModalVisible: visible });
  }

  setLocationModalVisible(visible) {
    this.setState({ locationModalVisible: visible });
  }

  setIOSPickerVisible(visible) {
    this.setState({ iOSPickerVisible: visible });
  }

  // If dectects unsubmitted report (incidentDesc or incidentLocationDesc),
  // ask the user what to do
  async continue() {
    const pre_Desc = JSON.parse(await AsyncStorage.getItem("incidentDesc"));
    const pre_Location_Desc = JSON.parse(
      await AsyncStorage.getItem("incidentLocationDesc")
    );
    const pre_Category = JSON.parse(
      await AsyncStorage.getItem("incidentCategory")
    );
    if (pre_Desc !== "" || pre_Location_Desc !== "") {
      Alert.alert(
        "Continue?",
        "Detected an unsubmitted report, what do you want to do?",
        [
          {
            text: "Continue editting",
            onPress: () => {
              // If the user choose to continue editting previous report,
              // reset all text states to previous one
              this.setState({ incidentCategory: pre_Category });
              this.setState({ incidentDesc: pre_Desc });
              this.setState({
                incidentLocationDesc: pre_Location_Desc
              });
            }
          },
          {
            text: "Start a new one",
            onPress: () => {
              // If the user choose to start a new report,
              // reset all text states to ""
              this.setState({ incidentCategory: "" });
              this.setState({ incidentDesc: "" });
              this.setState({ incidentLocationDesc: "" });
            },
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
  }

  // When the user create a report, start detecting previous unsubmitted report
  async handleNon(visible) {
    this.setReportModalVisible(visible);
    this.delay = setTimeout(() => {
      this.continue();
    }, 100);
  }

  // store texts in AsyncStorage
  async storeItem(key, item) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log(error.message);
    }
  }

  // retrieve texts from AsyncStorage (incidentDesc or incidentLocationDesc)
  async retrieveItem(key) {
    try {
      const item = JSON.parse(await AsyncStorage.getItem(key));
      if (key === "incidentDesc") {
        // set text to text stored in AsyncStorage
        this.setState({ incidentDesc: item });
        return item;
      } else if (key === "incidentLocationDesc") {
        // set text to text stored in AsyncStorage
        this.setState({ incidentLocationDesc: item });
        return item;
      }
      return;
    } catch (error) {
      console.log(error.message);
    }
    return;
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

  render() {
    const IncidentTypePicker = createIncidentTypePicker;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header style={styles.header}>
            <Left>
              {/* Icon used to open Side Drawer */}
              <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-menu`}
                style={styles.icon}
                onPress={() => this.props.navigation.openDrawer()}
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
                    (Platform.OS === "ios" ? "telprompt:" : "tel:") + "911";
                  return Linking.canOpenURL(url).then(canOpen => {
                    if (canOpen) {
                      return Linking.openURL(url).catch(err =>
                        Promise.reject(err)
                      );
                    } else {
                      Promise.reject(new Error("invalid URL provided: " + url));
                    }
                  });
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
                    (Platform.OS === "ios" ? "telprompt:" : "tel:") +
                    "8314592231";
                  return Linking.canOpenURL(url).then(canOpen => {
                    if (canOpen) {
                      return Linking.openURL(url).catch(err =>
                        Promise.reject(err)
                      );
                    } else {
                      Promise.reject(new Error("invalid URL provided: " + url));
                    }
                  });
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
                    "Please make sure this report is not emergency",
                    [
                      {
                        text: "Non emergency",
                        // Run when it's not emergency
                        onPress: () => this.handleNon(true)
                      },
                      {
                        text: "Emergency",
                        onPress: () => {
                          var url =
                            (Platform.OS === "ios" ? "telprompt:" : "tel:") +
                            "911";
                          return Linking.canOpenURL(url).then(canOpen => {
                            if (canOpen) {
                              return Linking.openURL(url).catch(err =>
                                Promise.reject(err)
                              );
                            } else {
                              Promise.reject(
                                new Error("invalid URL provided: " + url)
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

        {/* Report Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.reportModalVisible}
          onRequestClose={() => {
            this.setReportModalVisible(!this.state.reportModalVisible);
            // Save current texts in AsyncStorage when the window closes
            this.storeItem("incidentCategory", this.state.incidentCategory);
            this.storeItem("incidentDesc", this.state.incidentDesc);
            this.storeItem(
              "incidentLocationDesc",
              this.state.incidentLocationDesc
            );
          }}
        >
          <Container>
            <Header style={styles.header_modal}>
              <Left>
                <Icon
                  name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-back`}
                  style={styles.icon}
                  onPress={() => {
                    this.setReportModalVisible(!this.state.reportModalVisible);
                    // Save current texts in AsyncStorage when the window closes
                    this.storeItem(
                      "incidentCategory",
                      this.state.incidentCategory
                    );
                    this.storeItem("incidentDesc", this.state.incidentDesc);
                    this.storeItem(
                      "incidentLocationDesc",
                      this.state.incidentLocationDesc
                    );
                  }}
                />
              </Left>
              <Body>
                <Text style={styles.footer_text}>Report</Text>
              </Body>
              <Right />
            </Header>
            <Content contentContainerStyle={styles.container}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 24 }}>Incident Type:</Text>
                <IncidentTypePicker homeScreen={this} />
              </View>
              {/* Report Body goes here. Currently has
                                a dropdown menu & a text field
                            */}
              <Text style={{ fontSize: 24 }}>Incident Description</Text>

              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={6}
                placeholder="Please enter a description of the incident"
                onChangeText={incidentDesc => this.setState({ incidentDesc })}
                value={this.state.incidentDesc}
              />

              <Text style={{ fontSize: 24 }}>Description of Location</Text>

              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                placeholder="Please describe the location of the Incident. (Floor #, room #, etc)"
                onChangeText={incidentLocationDesc =>
                  this.setState({ incidentLocationDesc })
                }
                value={this.state.incidentLocationDesc}
              />
              <View style={{ flexDirection: "row" }}>
                {/* Button that allows Camera (Modal) to be opened */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    this.setCameraModalVisible(true);
                  }}
                >
                  <Icon
                    name={`${Platform.OS === "ios" ? "ios" : "md"}-camera`}
                    style={{ color: "white" }}
                  />
                  <Text style={{ color: "white" }}>Attach Media</Text>
                </TouchableOpacity>
                {/* Button that allows Location (Modal) to be opened */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    this.setLocationModalVisible(true);
                  }}
                >
                  <Icon
                    name={`${Platform.OS === "ios" ? "ios" : "md"}-pin`}
                    style={{ color: "white" }}
                  />
                  <Text style={{ color: "white" }}>Mark on Map</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* Button that allows Modal to be closed */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    this.setReportModalVisible(!this.state.reportModalVisible);
                    // Save current texts in AsyncStorage when the window closes
                    this.storeItem(
                      "incidentCategory",
                      this.state.incidentCategory
                    );
                    this.storeItem("incidentDesc", this.state.incidentDesc);
                    this.storeItem(
                      "incidentLocationDesc",
                      this.state.incidentLocationDesc
                    );
                  }}
                >
                  <Icon
                    name={`${Platform.OS === "ios" ? "ios" : "md"}-close`}
                    style={{ color: "white" }}
                  />
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>
                {/* Button that allows report to be sent */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    Alert.alert(
                      this.state.incidentCategory + " Report Submitted",
                      "Thank you for reporting. We will try our best to solve this issue as soon as possible.",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            // Store submitted report in AsyncStorage
                            // Store blank texts in AsyncStorage
                            this.storeItem(
                              "incidentCategory_sub",
                              this.state.incidentCategory
                            );
                            this.setState({
                              incidentCategory: ""
                            });
                            this.storeItem("incidentCategory", "");
                            this.storeItem(
                              "incidentDesc_sub",
                              this.state.incidentDesc
                            );
                            this.setState({
                              incidentDesc: ""
                            });
                            this.storeItem("incidentDesc", "");
                            this.storeItem(
                              "incidentLocationDesc_sub",
                              this.state.incidentLocationDesc
                            );
                            this.setState({
                              incidentLocationDesc: ""
                            });
                            this.storeItem("incidentLocationDesc", "");
                            this.setReportModalVisible(
                              !this.state.reportModalVisible
                            );
                          }
                        },
                        {
                          text: "Check the status of my report: ",
                          onPress: () => {
                            // Store submitted report in AsyncStorage
                            // Store blank texts in AsyncStorage
                            this.storeItem(
                              "incidentCategory_sub",
                              this.state.incidentCategory
                            );
                            this.setState({
                              incidentCategory: ""
                            });
                            this.storeItem("incidentCategory", "");
                            this.storeItem(
                              "incidentDesc_sub",
                              this.state.incidentDesc
                            );
                            this.setState({
                              incidentDesc: ""
                            });
                            this.storeItem("incidentDesc", "");
                            this.storeItem(
                              "incidentLocationDesc_sub",
                              this.state.incidentLocationDesc
                            );
                            this.setState({
                              incidentLocationDesc: ""
                            });
                            this.storeItem("incidentLocationDesc", "");
                            this.setReportModalVisible(
                              !this.state.reportModalVisible
                            );
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  <Icon
                    name={`${Platform.OS === "ios" ? "ios" : "md"}-send`}
                    style={{ color: "white" }}
                  />
                  <Text style={{ color: "white" }}>Submit</Text>
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
            {/* iOS picker Modal*/}
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.iOSPickerVisible}
              onRequestClose={() => {
                this.setIOSPickerVisible(!this.state.iOSPickerVisible);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000000C0"
                }}
              >
                <View
                  style={{
                    width: 300,
                    height: 200,
                    backgroundColor: "#CCC",
                    padding: 20
                  }}
                >
                  <ScrollView>
                    <SelectableListScene
                      list={[
                        "Trash",
                        "Water Leak",
                        "Broken Light",
                        "Broken Window",
                        "Lighting deficiency"
                      ]}
                      onPressAction={selectedItem => {
                        this.setState({
                          incidentCategory: selectedItem
                        });
                        this.setIOSPickerVisible(!this.state.iOSPickerVisible);
                      }}
                    />
                  </ScrollView>
                </View>
              </View>
            </Modal>
            {/* Camera Modal. TODO: Replace with actual camera.*/}
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.cameraModalVisible}
              onRequestClose={() => {
                this.setCameraModalVisible(!this.state.cameraModalVisible);
              }}
            >
              <Container>
                <Header style={styles.header_modal}>
                  <Left>
                    <Icon
                      name={`${
                        Platform.OS === "ios" ? "ios" : "md"
                      }-arrow-back`}
                      style={styles.icon}
                      onPress={() => {
                        this.setCameraModalVisible(
                          !this.state.cameraModalVisible
                        );
                      }}
                    />
                  </Left>
                  <Body />
                  <Right />
                </Header>
                <Content contentContainerStyle={styles.container}>
                  <Text>Camera</Text>
                  <Button
                    title="Close"
                    onPress={() => {
                      this.setCameraModalVisible(
                        !this.state.cameraModalVisible
                      );
                    }}
                  />
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
            </Modal>
            {/* Location Modal. TODO: Replace with actual location.*/}
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.locationModalVisible}
              onRequestClose={() => {
                this.setLocationModalVisible(!this.state.locationModalVisible);
              }}
            >
              <Container>
                <Header style={styles.header_modal}>
                  <Left>
                    <Icon
                      name={`${
                        Platform.OS === "ios" ? "ios" : "md"
                      }-arrow-back`}
                      style={styles.icon}
                      onPress={() => {
                        this.setLocationModalVisible(
                          !this.state.locationModalVisible
                        );
                      }}
                    />
                  </Left>
                  <Body />
                  <Right />
                </Header>
                <Content contentContainerStyle={styles.container}>
                  <Text>Location</Text>
                  <Button
                    title="Close"
                    onPress={() => {
                      this.setLocationModalVisible(
                        !this.state.locationModalVisible
                      );
                    }}
                  />
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
            </Modal>
          </Container>
        </Modal>
      </SafeAreaView>
    );
  }
}
export default HomeScreen;