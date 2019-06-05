/*
 * styles.js
 * Essentially just a stylesheet for App
 */

import { Dimensions, StatusBar, StyleSheet, Platform } from "react-native";

/*
    Styles-wide colors; rule of thumb is to keep colors constant! 
    Try to only use these constants wherever you can.

    Of course, it's to be noted that you can do whatever the heck you want!
*/
const darktheme = false;
const StatusBarComp = Platform.OS == "ios" ? 0 : StatusBar.currentHeight;
//"#376f9d"
//"#2384BC"
//"#49ACE5"
//"#145d99" - Arthur 5/13/19
const primaryColor = "#145d99"; // Blue - Header/Footer, Buttons, Footer Text, Highlights.
const secondaryColor = "white"; // Counter to the primary color (Header/Footer Text, etc)
const tertiaryColor = "black"; // Mostly Text
//"#CCC"
//const quaternaryColor = "#dbdbdb"; // Background Colors (containers, drawer)
const quaternaryColor = "#e8e8e8"; // Background Colors (containers, drawer)

//const containerColor = "#FFFFFF80";
//const containerColor = "#00000040";
//const containerColor = "#bfbfbf";
const containerColor = "#fffeff";
const containerSecondaryColor = quaternaryColor;
const containerTertiaryColor = "#00000040";

const containerBorderColor = "#00000090";
//const containerBorderWidth = 0;
const containerBorderWidth = 0;
const containerBorderWidthWide = 0;
//const containerBorderRadius = 10;
const containerBorderRadius = 22;
const containerBorderRadiusSmall = 10;

const tipColor = "#795CBC";

/*
    Traffic light variables; based around the dimensions of the encompassing window. 
    In order to make the traffic light bigger/smaller, make the modifier value larger or smaller.
*/
const trafficLightModifier = 1.0;
const trafficLightHeight =
  Dimensions.get("window").height * trafficLightModifier;

export const trafficDimensions = {
  height: trafficLightHeight
};

/*
    Footer text. Constant across application.
*/
const footerText = "CruzSafe";
export const textConstants = { footerText: footerText };

export default (styles = StyleSheet.create({
  drawerImgContainer: {
    height: 150,
    backgroundColor: darktheme ? "#49ACE5" : quaternaryColor,
    alignItems: "center",
    justifyContent: "center"
  },
  drawerScrollViewBackground: {
    backgroundColor: darktheme ? tertiaryColor : quaternaryColor
  },
  drawerText: {
    fontSize: Dimensions.get("window").height * 0.027,
    fontWeight: "bold",
    color: primaryColor
  },
  welcomeScreenLogo: {
    width: Dimensions.get("window").width * 0.75,
    height: Dimensions.get("window").width * 0.65,
    marginBottom: Dimensions.get("window").width * 0.15
  },
  linkText: {
    fontSize: Dimensions.get("window").height * 0.025,
    fontWeight: "bold",
    color: secondaryColor,
    textAlign: "center"
  },
  linkTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor,
    marginVertical: Dimensions.get("window").height * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.03
  },
  linkDescriptionText: {
    fontSize: Dimensions.get("window").height * 0.025,
    fontWeight: "bold",
    color: tertiaryColor,
    textAlign: "center",
    marginVertical: Dimensions.get("window").height * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.04
  },
  linksContainer: {
    /*flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",*/
    backgroundColor: darktheme ? primaryColor : quaternaryColor
  },
  linkRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: darktheme ? primaryColor : quaternaryColor,
    alignItems: "center"
  },
  linkPicture: {
    flex: 1,
    width: "100%",
    height: "65%",
    borderRadius: Dimensions.get("window").width * 0.02,
    overflow: "hidden"
  },
  linkContainer: {
    height: Dimensions.get("window").height * 0.29,
    width: Dimensions.get("window").width * 0.45,
    justifyContent: "center",
    padding: Dimensions.get("window").width * 0.01,
    borderRadius: Dimensions.get("window").width * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    marginVertical: Dimensions.get("window").height * 0.01,
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor
  },
  incidentsScrollContainer: {
    marginVertical: Dimensions.get("window").height * 0.007,
    maxHeight: Dimensions.get("window").height * 0.7
  },
  incidentsContainer: {
    /*flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",*/
<<<<<<< HEAD
    //backgroundColor: darktheme ? primaryColor : quaternaryColor
    //maxHeight: Dimensions.get("window").height * 0.6,
    overflow: "scroll",
    backgroundColor: secondaryColor
  },
  incidentRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    //backgroundColor: darktheme ? primaryColor : quaternaryColor,
    alignItems: "center"
  },
  incidentContainer: {
    height: Dimensions.get("window").height * 0.13,
    width: "47%",
    //height: Dimensions.get("window").height * 0.17,
    //width: "30%",
    justifyContent: "center",
    padding: Dimensions.get("window").width * 0.012,
    borderRadius: Dimensions.get("window").width * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.015,
    marginVertical: Dimensions.get("window").height * 0.007,
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: containerSecondaryColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor
  },
  incidentPicture: {
    flex: 1,
    width: "100%",
    height: "auto",
    borderRadius: Dimensions.get("window").width * 0.02,
    overflow: "hidden"
  },
  incidentbtn: {
    position: "absolute",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    bottom: 0,
    backgroundColor: containerTertiaryColor
  },
  incidentText: {
    fontSize: Dimensions.get("window").height * 0.02,
    fontWeight: "bold",
    color: secondaryColor,
    textAlign: "center"
  },
  AboutUSRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: darktheme ? primaryColor : quaternaryColor,
    alignItems: "center"
  },
  aboutUsPicture: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: Dimensions.get("window").width * 0.02,
    overflow: "hidden"
  },
  aboutUsPictureContainer: {
    height: Dimensions.get("window").height * 0.18,
    width: Dimensions.get("window").width * 0.25,
    justifyContent: "center",
    paddingVertical: Dimensions.get("window").width * 0.012,
    paddingHorizontal: Dimensions.get("window").width * 0.012,
    borderRadius: Dimensions.get("window").width * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    marginVertical: Dimensions.get("window").height * 0.01,
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: primaryColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor
  },
  aboutUsTextContainer: {
    height: "auto",
    width: Dimensions.get("window").width * 0.67,
    justifyContent: "center",
    paddingVertical: Dimensions.get("window").width * 0.03,
    paddingHorizontal: Dimensions.get("window").width * 0.02,
    borderRadius: Dimensions.get("window").width * 0.02,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    marginVertical: Dimensions.get("window").height * 0.008,
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor
  },
  aboutUsText: {
    //fontSize: Dimensions.get("window").height * 0.035,
    color: tertiaryColor,
    textAlign: "left"
  },
  aboutUsBoldText: {
    fontSize: Dimensions.get("window").height * 0.027,
    color: tertiaryColor,
    textAlign: "left",
    fontWeight: "bold"
  },
  linkbtn: {
    marginTop: "8%",
    padding: 10,
    height: "35%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
    borderRadius: 10
  },
  background: {
    height: Dimensions.get("window").height,
    width: "auto",
    backgroundColor: darktheme ? tertiaryColor : quaternaryColor,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: darktheme ? "#49ACE5" : quaternaryColor,
    alignItems: "center",
    justifyContent: "center"
  },
  reportContainer: {
    //flex: 0.95,
    //justifyContent: "center",
    width: "90%",
    padding: "4%",
    borderRadius: containerBorderRadius,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidthWide,
    borderColor: containerBorderColor,
    height: "96%"
    //height: Dimensions.get("window").height * 0.8
  },
  reportSubcontainer: {
    width: "100%",
    height: "97%"
  },
  reportSingleContainer: {
    flex: 0.95,
    justifyContent: "space-around",
    width: "90%",
    padding: 10,
    borderRadius: containerBorderRadius,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidthWide,
    borderColor: containerBorderColor
  },
  feedbackContainer: {
    flex: 0.95,
    justifyContent: "center",
    width: "90%",
    padding: 10,
    borderRadius: containerBorderRadius,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidthWide,
    borderColor: containerBorderColor
  },
  feedbackSubmit: {
    marginTop: 5,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7BCC53",
    borderRadius: 10
  },
  reportBtnFull: {
    marginTop: 5,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
    borderRadius: 10
  },
  reportNavigation: {
    height: Dimensions.get("window").height * 0.08,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },
  reportNavigationBtnHalf: {
    marginTop: 5,
    padding: 5,
    flex: 0.49,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
    borderColor: "#000000",
    borderRadius: 10
  },
  reportNavigationBtnFull: {
    marginTop: 5,
    padding: 5,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
    borderColor: "#000000",
    borderRadius: 10
  },
  reportBtnHalf: {
    marginTop: 5,
    padding: 5,
    flex: 0.49,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
    borderRadius: 10
  },
  reportBtnCancel: {
    marginTop: 5,
    padding: 5,
    flex: 0.49,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F26860",
    borderRadius: 10
  },
  reportBtnSubmit: {
    marginTop: 5,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7BCC53",
    borderRadius: 10
  },
  reportBtnImg: {
    flex: 1,
    marginVertical: 1,
    backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
    borderRadius: 5
  },
  reportHistoryText: {
    color: tertiaryColor,
    fontWeight: "bold",
    fontSize: 24,
    margin: 5
    //alignSelf: "center"
  },
  header: {
    marginTop: StatusBarComp,
    backgroundColor: darktheme ? tertiaryColor : primaryColor
  },
  header_image: {
    marginTop: StatusBarComp,
    backgroundColor: tertiaryColor,
    shadowColor: tertiaryColor,
    borderBottomWidth: 0
  },
  header_modal: {
    backgroundColor: darktheme ? tertiaryColor : primaryColor
  },
  footer: {
    backgroundColor: darktheme ? tertiaryColor : primaryColor
  },
  icon: {
    color: darktheme ? primaryColor : "silver",
    marginLeft: 10
  },
  header_text: {
    color: darktheme ? primaryColor : secondaryColor,
    fontSize: Dimensions.get("window").height * 0.027,
    fontWeight: "bold"
  },
  footer_text: {
    color: darktheme ? primaryColor : secondaryColor,
    fontSize: Dimensions.get("window").height * 0.027,
    fontWeight: "bold"
  },
  traffic_text: {
    //color: darktheme ? tertiaryColor : secondaryColor,
    color: tertiaryColor,
    fontSize:
      Dimensions.get("window").height *
      0.027 *
      Math.min(trafficLightModifier, 1.0),
    fontWeight: "bold"
  },
  traffic_light_background: {
    width: trafficLightHeight * 0.29,
    height: trafficLightHeight * 0.75,
    alignItems: "center"
  },
  textContainer: {
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF40",
    marginVertical: Dimensions.get("window").height * 0.01,
    marginHorizontal: Dimensions.get("window").width * 0.01
  },
  textInput: {
    margin: 1,
    padding: 5,
    textAlignVertical: "top",
    backgroundColor: "#EEE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3338",
    fontSize: Dimensions.get("window").width * 0.04
  },
  textInputWelcome: {
    width: "90%",
    margin: 1,
    padding: 5,
    backgroundColor: "#EEE",
    borderRadius: 5
  },
  textInputFeedback: {
    margin: 1,
    padding: 5,
    textAlignVertical: "top",
    backgroundColor: "#EEE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3338",
    flex: 1
  },
  imageContainer: {
    justifyContent: "center",
    marginTop: 40,
    padding: 4,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF40"
  },
  picker: {
    padding: 2
  },
  picker_view: {
    margin: 5,
    width: "80%",
    backgroundColor: "#EEE",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 2
  },
  btn: {
    margin: 1,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 125,
    backgroundColor: darktheme ? tertiaryColor : primaryColor
  },
  locbtn: {
    margin: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 5,
    backgroundColor: darktheme ? tertiaryColor : primaryColor
  },
  btnTextWhite: {
    color: secondaryColor
  },
  btnTextBlack: {
    color: tertiaryColor
  },
  signinBtn: {
    margin: 1,
    padding: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: tertiaryColor,
    shadowOpacity: 1.0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#A89300"
  },
  slideOuterButton: {
    marginBottom: 30
  },
  btn_disabled: {
    margin: 5,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 125,
    backgroundColor: "#999"
  },
  dropdown_menu: {
    padding: 5,
    margin: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3338"
  },
  fieldFooterBackground: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: primaryColor,
    color: secondaryColor,
    textAlign: "right",
    marginLeft: 10,
    marginRight: 0,
    marginBottom: 5,
    marginTop: 0,
    padding: 5,
    fontSize: 8
  },
  fieldHeaderBackgroundFull: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: primaryColor,
    color: secondaryColor,
    textAlign: "left",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 5,
    padding: 5,
    fontSize: Dimensions.get("window").height * 0.027,
    fontWeight: "bold"
  },
  fieldHeaderBackground: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 0,
    backgroundColor: primaryColor,
    color: secondaryColor,
    textAlign: "left",
    marginLeft: 0,
    marginRight: 10,
    marginBottom: 0,
    marginTop: 5,
    padding: 5,
    fontSize: Dimensions.get("window").height * 0.027,
    fontWeight: "bold"
  },
  summaryHeader: {
    borderRadius: 5,
    backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
    color: darktheme ? tertiaryColor : secondaryColor,
    textAlign: "left",
    padding: 5,
    fontSize: 20,
    fontWeight: "bold"
  },
  reportText: {
    color: tertiaryColor,
    fontWeight: "bold",
    fontSize: 24
  },
  reportDropDown: {
    marginRight: 5,
    fontSize: 14,
    marginBottom: 5
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#4488A7"
  },
  historyContainer: {
    flex: 0.44,
    padding: 10,
    borderRadius: containerBorderRadiusSmall,
    backgroundColor: containerColor,
    borderWidth: containerBorderWidth,
    borderColor: containerBorderColor
  },
  reportBtn: {
    flex: 1,
    padding: 10,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: darktheme ? primaryColor : primaryColor,
    borderRadius: 10
  },
  slideOuterContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  slideImageContainer: {
    flex: 1,
    justifyContent: "center"
  },
  slideTextContainer: {
    justifyContent: "flex-start"
  },
  slideTextContainerTutorial: {
    justifyContent: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  slideText: {
    fontSize: 15
  },
  slideText4: {
    fontSize: 18
  },
  slideText7: {
    fontSize: 20,
    fontWeight: "bold"
  },
  slideblue: {
    padding: 10,
    backgroundColor: "rgba(20,93,153,0.2)"
  },
  slidetan: {
    padding: 10,
    backgroundColor: "rgba(153,76,0,0.2)"
  },
  slidered: {
    padding: 10,
    backgroundColor: "rgba(255,0,0,0.2)"
  },
  slideyellow: {
    padding: 10,
    backgroundColor: "rgba(255,255,0,0.2)"
  },
  slidegreen: {
    padding: 10,
    backgroundColor: "rgba(0,204,0,0.2)"
  },
  markLocation: {
    fontSize: 17,
    color: "white"
  },
  refreshBtn: {
    flex: 0.09,
    margin: 1,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#479e59"
  },
  locationHidden: {
    position: "absolute",
    left: -1000,
    top: -1000
  },
  selectionLocationIOS: {
    zIndex: 2,
    top: -80,
    left: -6,
    height: 0
  },
  selectionLocationAndroid: {
    zIndex: 2,
    top: 17,
    height: 130,
    position: "absolute"
  },
  selectionTriangle: {
    position: "absolute",
    left: 195,
    top: -16,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderBottomColor: tipColor,
    borderLeftWidth: 9,
    borderLeftColor: "transparent"
  },
  descriptionLocationIOS: {
    zIndex: 2,
    top: 15,
    left: -6,
    height: 0
  },
  descriptionLocationAndroid: {
    zIndex: 2,
    top: 17,
    height: 115,
    position: "absolute"
  },
  descriptionTriangle: {
    position: "absolute",
    left: 145,
    top: -16,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderBottomColor: tipColor,
    borderLeftWidth: 9,
    borderLeftColor: "transparent"
  },
  locationLocationIOS: {
    zIndex: 2,
    top: 15,
    left: -6,
    height: 0
  },
  locationLocationAndroid: {
    zIndex: 2,
    top: 17,
    height: 115,
    position: "absolute"
  },
  locationTriangle: {
    position: "absolute",
    left: 110,
    top: -16,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderBottomColor: tipColor,
    borderLeftWidth: 9,
    borderLeftColor: "transparent"
  },
  cameraLocationIOS: {
    zIndex: 2,
    top: 77,
    left: -6,
    height: 0
  },
  cameraLocationAndroid: {
    zIndex: 2,
    top: -142,
    height: 130,
    position: "absolute"
  },
  cameraTriangle1: {
    position: "absolute",
    left: 70,
    top: -16,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderBottomColor: tipColor,
    borderLeftWidth: 9,
    borderLeftColor: "transparent"
  },
  cameraTriangle2: {
    position: "absolute",
    left: 200,
    top: -16,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderBottomColor: tipColor,
    borderLeftWidth: 9,
    borderLeftColor: "transparent"
  },
  mapLocationIOS: {
    zIndex: 2,
    top: -100,
    left: -6,
    height: 0
  },
  mapLocationAndroid: {
    zIndex: 2,
    top: -100,
    height: 95,
    position: "absolute"
  },
  mapTriangle: {
    position: "absolute",
    left: 135,
    top: 95,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 10,
    borderTopWidth: 18,
    borderTopColor: tipColor,
    borderLeftWidth: 10,
    borderLeftColor: "transparent"
  },
  submissionLocationIOS: {
    zIndex: 2,
    top: -155,
    left: -6,
    height: 0
  },
  submissionLocationAndroid: {
    zIndex: 2,
    top: -155,
    height: 145,
    position: "absolute"
  },
  submissionTriangle1: {
    position: "absolute",
    left: 61,
    top: 145,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 10,
    borderTopWidth: 18,
    borderTopColor: tipColor,
    borderLeftWidth: 10,
    borderLeftColor: "transparent"
  },
  submissionTriangle2: {
    position: "absolute",
    left: 207,
    top: 145,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 10,
    borderTopWidth: 18,
    borderTopColor: tipColor,
    borderLeftWidth: 10,
    borderLeftColor: "transparent"
  },
  thumbnailLocationIOS: {
    zIndex: 2,
    top: -105,
    left: -6,
    height: 0
  },
  thumbnailLocationAndroid: {
    zIndex: 2,
    top: -105,
    height: 230,
    position: "absolute"
  },
  thumbnailTriangle: {
    position: "absolute",
    left: 190,
    top: 95,
    width: 3,
    height: 3,
    borderRightColor: "transparent",
    borderRightWidth: 10,
    borderTopWidth: 18,
    borderTopColor: tipColor,
    borderLeftWidth: 10,
    borderLeftColor: "transparent"
  },
  tipBubbleSquare: {
    width: 280,
    height: 130,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tipColor,
    borderRadius: 15,
    borderWidth: 8,
    borderColor: tipColor
  },
  tipBubbleBig: {
    width: 280,
    height: 145,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tipColor,
    borderRadius: 15,
    borderWidth: 8,
    borderColor: tipColor
  },
  tipBubbleSmallest: {
    width: 280,
    height: 95,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tipColor,
    borderRadius: 15,
    borderWidth: 8,
    borderColor: tipColor
  },
  tipBubbleSmaller: {
    width: 280,
    height: 115,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tipColor,
    borderRadius: 15,
    borderWidth: 8,
    borderColor: tipColor
  },
  mainTipText: {
    fontSize: 15,
    color: secondaryColor
  },
  continue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FADE4F"
  },
  stopTips: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B7B7B7"
  },
  cameraColumn: {
    flex: 1 / 3,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  }
=======
        //backgroundColor: darktheme ? primaryColor : quaternaryColor
        //maxHeight: Dimensions.get("window").height * 0.6,
        overflow: "scroll",
        backgroundColor: secondaryColor
    },
    incidentRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        //backgroundColor: darktheme ? primaryColor : quaternaryColor,
        alignItems: "center"
    },
    incidentContainer: {
        height: Dimensions.get("window").height * 0.13,
        width: "47%",
        //height: Dimensions.get("window").height * 0.17,
        //width: "30%",
        justifyContent: "center",
        padding: Dimensions.get("window").width * 0.012,
        borderRadius: Dimensions.get("window").width * 0.02,
        marginHorizontal: Dimensions.get("window").width * 0.015,
        marginVertical: Dimensions.get("window").height * 0.007,
        borderRadius: containerBorderRadiusSmall,
        backgroundColor: containerSecondaryColor,
        borderWidth: containerBorderWidth,
        borderColor: containerBorderColor
    },
    incidentPicture: {
        flex: 1,
        width: "100%",
        height: "auto",
        borderRadius: Dimensions.get("window").width * 0.02,
        overflow: "hidden"
    },
    incidentbtn: {
        position: "absolute",
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        bottom: 0,
        backgroundColor: containerTertiaryColor
    },
    incidentText: {
        fontSize: Dimensions.get("window").height * 0.02,
        fontWeight: "bold",
        color: secondaryColor,
        textAlign: "center"
    },
    AboutUSRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: darktheme ? primaryColor : quaternaryColor,
        alignItems: "center"
    },
    aboutUsPicture: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: Dimensions.get("window").width * 0.02,
        overflow: "hidden"
    },
    aboutUsPictureContainer: {
        height: Dimensions.get("window").height * 0.18,
        width: Dimensions.get("window").width * 0.25,
        justifyContent: "center",
        paddingVertical: Dimensions.get("window").width * 0.012,
        paddingHorizontal: Dimensions.get("window").width * 0.012,
        borderRadius: Dimensions.get("window").width * 0.02,
        marginHorizontal: Dimensions.get("window").width * 0.01,
        marginVertical: Dimensions.get("window").height * 0.01,
        borderRadius: containerBorderRadiusSmall,
        backgroundColor: primaryColor,
        borderWidth: containerBorderWidth,
        borderColor: containerBorderColor
    },
    aboutUsTextContainer: {
        height: "auto",
        width: Dimensions.get("window").width * 0.67,
        justifyContent: "center",
        paddingVertical: Dimensions.get("window").width * 0.03,
        paddingHorizontal: Dimensions.get("window").width * 0.02,
        borderRadius: Dimensions.get("window").width * 0.02,
        marginHorizontal: Dimensions.get("window").width * 0.01,
        marginVertical: Dimensions.get("window").height * 0.008,
        borderRadius: containerBorderRadiusSmall,
        backgroundColor: containerColor,
        borderWidth: containerBorderWidth,
        borderColor: containerBorderColor
    },
    aboutUsText: {
        //fontSize: Dimensions.get("window").height * 0.035,
        color: tertiaryColor,
        textAlign: "left"
    },
    aboutUsBoldText: {
        fontSize: Dimensions.get("window").height * 0.027,
        color: tertiaryColor,
        textAlign: "left",
        fontWeight: "bold"
    },
    linkbtn: {
        marginTop: "8%",
        padding: 10,
        height: "35%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: primaryColor,
        borderRadius: 10
    },
    background: {
        height: Dimensions.get("window").height,
        width: "auto",
        backgroundColor: darktheme ? tertiaryColor : quaternaryColor,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: darktheme ? "#49ACE5" : quaternaryColor,
        alignItems: "center",
        justifyContent: "center"
    },
    reportContainer: {
        //flex: 0.95,
        //justifyContent: "center",
        width: "90%",
        padding: "4%",
        borderRadius: containerBorderRadius,
        backgroundColor: containerColor,
        borderWidth: containerBorderWidthWide,
        borderColor: containerBorderColor,
        height: "96%"
        //height: Dimensions.get("window").height * 0.8
    },
    reportSubcontainer: {
        width: "100%",
        height: "97%"
    },
    reportSingleContainer: {
        flex: 0.95,
        justifyContent: "space-around",
        width: "90%",
        padding: 10,
        borderRadius: containerBorderRadius,
        backgroundColor: containerColor,
        borderWidth: containerBorderWidthWide,
        borderColor: containerBorderColor
    },
    feedbackContainer: {
        flex: 0.95,
        justifyContent: "center",
        width: "90%",
        padding: 10,
        borderRadius: containerBorderRadius,
        backgroundColor: containerColor,
        borderWidth: containerBorderWidthWide,
        borderColor: containerBorderColor
    },
    feedbackSubmit: {
        marginTop: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7BCC53",
        borderRadius: 10
    },
    reportBtnFull: {
        marginTop: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
        borderRadius: 10
    },
    reportNavigation: {
        height: Dimensions.get("window").height * 0.08,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15
    },
    reportNavigationBtnHalf: {
        marginTop: 5,
        padding: 5,
        flex: 0.49,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000090",
        borderColor: "#000000",
        borderRadius: 10
    },
    reportNavigationBtnFull: {
        marginTop: 5,
        padding: 5,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000090",
        borderColor: "#000000",
        borderRadius: 10
    },
    reportBtnHalf: {
        marginTop: 5,
        padding: 5,
        flex: 0.49,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
        borderRadius: 10
    },
    reportBtnCancel: {
        marginTop: 5,
        padding: 5,
        flex: 0.49,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F26860",
        borderRadius: 10
    },
    reportBtnSubmit: {
        marginTop: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7BCC53",
        borderRadius: 10
    },
    reportBtnImg: {
        flex: 1,
        marginVertical: 1,
        backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
        borderRadius: 5
    },
    reportHistoryText: {
        color: tertiaryColor,
        fontWeight: "bold",
        fontSize: 24,
        margin: 5
        //alignSelf: "center"
    },
    header: {
        marginTop: StatusBarComp,
        backgroundColor: darktheme ? tertiaryColor : primaryColor
    },
    header_image: {
        marginTop: StatusBarComp,
        backgroundColor: tertiaryColor,
        shadowColor: tertiaryColor,
        borderBottomWidth: 0
    },
    header_modal: {
        backgroundColor: darktheme ? tertiaryColor : primaryColor
    },
    footer: {
        backgroundColor: darktheme ? tertiaryColor : primaryColor
    },
    icon: {
        color: darktheme ? primaryColor : "silver",
        marginLeft: 10
    },
    header_text: {
        color: darktheme ? primaryColor : secondaryColor,
        fontSize: Dimensions.get("window").height * 0.027,
        fontWeight: "bold"
    },
    footer_text: {
        color: darktheme ? primaryColor : secondaryColor,
        fontSize: Dimensions.get("window").height * 0.027,
        fontWeight: "bold"
    },
    traffic_text: {
        //color: darktheme ? tertiaryColor : secondaryColor,
        color: tertiaryColor,
        fontSize:
            Dimensions.get("window").height *
            0.027 *
            Math.min(trafficLightModifier, 1.0),
        fontWeight: "bold"
    },
    traffic_light_background: {
        width: trafficLightHeight * 0.29,
        height: trafficLightHeight * 0.75,
        alignItems: "center"
    },
    textContainer: {
        justifyContent: "center",
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFF40",
        marginVertical: Dimensions.get("window").height * 0.01,
        marginHorizontal: Dimensions.get("window").width * 0.01
    },
    textInput: {
        margin: 1,
        padding: 5,
        textAlignVertical: "top",
        backgroundColor: "#EEE",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#3338",
        fontSize: Dimensions.get("window").width * 0.04
    },
    textInputWelcome: {
        width: "90%",
        margin: 1,
        padding: 5,
        backgroundColor: "#EEE",
        borderRadius: 5
    },
    textInputFeedback: {
        margin: 1,
        padding: 5,
        textAlignVertical: "top",
        backgroundColor: "#EEE",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#3338",
        flex: 1
    },
    imageContainer: {
        justifyContent: "center",
        marginTop: 40,
        padding: 4,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFF40"
    },
    picker: {
        padding: 2
    },
    picker_view: {
        margin: 5,
        width: "80%",
        backgroundColor: "#EEE",
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 2
    },
    btn: {
        margin: 1,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        borderRadius: 125,
        backgroundColor: darktheme ? tertiaryColor : primaryColor
    },
    locbtn: {
        margin: 1,
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
        borderRadius: 5,
        backgroundColor: darktheme ? tertiaryColor : primaryColor
    },
    btnTextWhite: {
        color: secondaryColor
    },
    btnTextBlack: {
        color: tertiaryColor
    },
    signinBtn: {
        margin: 1,
        padding: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: tertiaryColor,
        shadowOpacity: 1.0,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#A89300"
    },
    slideOuterButton: {
        marginBottom: 30
    },
    btn_disabled: {
        margin: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        borderRadius: 125,
        backgroundColor: "#999"
    },
    dropdown_menu: {
        padding: 5,
        margin: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#EEE",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#3338"
    },
    fieldFooterBackground: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: primaryColor,
        color: secondaryColor,
        textAlign: "right",
        marginLeft: 10,
        marginRight: 0,
        marginBottom: 5,
        marginTop: 0,
        padding: 5,
        fontSize: 8
    },
    fieldHeaderBackgroundFull: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: primaryColor,
        color: secondaryColor,
        textAlign: "left",
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 5,
        padding: 5,
        fontSize: Dimensions.get("window").height * 0.027,
        fontWeight: "bold"
    },
    fieldHeaderBackground: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 0,
        backgroundColor: primaryColor,
        color: secondaryColor,
        textAlign: "left",
        marginLeft: 0,
        marginRight: 10,
        marginBottom: 0,
        marginTop: 5,
        padding: 5,
        fontSize: Dimensions.get("window").height * 0.027,
        fontWeight: "bold"
    },
    summaryHeader: {
        borderRadius: 5,
        backgroundColor: darktheme ? "#E8E5E5" : primaryColor,
        color: darktheme ? tertiaryColor : secondaryColor,
        textAlign: "left",
        padding: 5,
        fontSize: 20,
        fontWeight: "bold"
    },
    reportText: {
        color: tertiaryColor,
        fontWeight: "bold",
        fontSize: 24
    },
    reportDropDown: {
        marginRight: 5,
        fontSize: 14,
        marginBottom: 5
    },
    itemContainer: {
        flex: 1,
        padding: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#4488A7"
    },
    historyContainer: {
        flex: 0.44,
        padding: 10,
        borderRadius: containerBorderRadiusSmall,
        backgroundColor: containerColor,
        borderWidth: containerBorderWidth,
        borderColor: containerBorderColor
    },
    reportBtn: {
        flex: 1,
        padding: 10,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: darktheme ? primaryColor : primaryColor,
        borderRadius: 10
    },
    slideOuterContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    slideImageContainer: {
        flex: 1,
        justifyContent: "center"
    },
    slideTextContainer: {
        justifyContent: "flex-start"
    },
    slideTextContainerTutorial: {
        justifyContent: "flex-start",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    slideText: {
        fontSize: 15
    },
    slideText4: {
        fontSize: 13
    },
    slideText7: {
        fontSize: 14
    },
    slideblue: {
        padding: 10,
        backgroundColor: "rgba(20,93,153,0.2)"
    },
    slidetan: {
        padding: 10,
        backgroundColor: "rgba(153,76,0,0.2)"
    },
    slidered: {
        padding: 10,
        backgroundColor: "rgba(255,0,0,0.2)"
    },
    slideyellow: {
        padding: 10,
        backgroundColor: "rgba(255,255,0,0.2)"
    },
    slidegreen: {
        padding: 10,
        backgroundColor: "rgba(0,204,0,0.2)"
    },
    markLocation: {
        fontSize: 17,
        color: "white"
    },
    refreshBtn: {
        flex: 0.09,
        margin: 1,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#479e59"
    },
    locationHidden: {
        position: "absolute",
        left: -1000,
        top: -1000
    },
    selectionLocationIOS: {
        zIndex: 2,
        top: -110,
        left: -6,
        height: 0
    },
    selectionLocationAndroid: {
        zIndex: 2,
        top: 17,
        height: 130,
        position: "absolute"
    },
    selectionTriangle: {
        position: "absolute",
        left: 195,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    descriptionLocationIOS: {
        zIndex: 2,
        top: 15,
        left: -6,
        height: 0
    },
    descriptionLocationAndroid: {
        zIndex: 2,
        top: 17,
        height: 115,
        position: "absolute"
    },
    descriptionTriangle: {
        position: "absolute",
        left: 145,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    locationLocationIOS: {
        zIndex: 2,
        top: 15,
        left: -6,
        height: 0
    },
    locationLocationAndroid: {
        zIndex: 2,
        top: 17,
        height: 115,
        position: "absolute"
    },
    locationTriangle: {
        position: "absolute",
        left: 110,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    cameraLocationIOS: {
        zIndex: 2,
        top: 77,
        left: -6,
        height: 0
    },
    cameraLocationAndroid: {
        zIndex: 2,
        top: -142,
        height: 130,
        position: "absolute"
    },
    cameraTriangle1: {
        position: "absolute",
        left: 70,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    cameraTriangle2: {
        position: "absolute",
        left: 200,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    mapLocationIOS: {
        zIndex: 2,
        top: -100,
        left: -6,
        height: 0
    },
    mapLocationAndroid: {
        zIndex: 2,
        top: -100,
        height: 95,
        position: "absolute"
    },
    mapTriangle: {
        position: "absolute",
        left: 135,
        top: 95,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: tipColor,
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    submissionLocationIOS: {
        zIndex: 2,
        top: -225,
        left: -6,
        height: 0
    },
    submissionLocationAndroid: {
        zIndex: 2,
        top: -155,
        height: 145,
        position: "absolute"
    },
    submissionTriangle1: {
        position: "absolute",
        left: 61,
        top: 145,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: tipColor,
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    submissionTriangle2: {
        position: "absolute",
        left: 207,
        top: 145,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: tipColor,
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    thumbnailLocationIOS: {
        zIndex: 2,
        top: -105,
        left: -6,
        height: 0
    },
    thumbnailLocationAndroid: {
        zIndex: 2,
        top: -105,
        height: 230,
        position: "absolute"
    },
    thumbnailTriangle: {
        position: "absolute",
        left: 145,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: tipColor,
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    tipBubbleSquare: {
        width: 280,
        height: 130,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tipColor,
        borderRadius: 15,
        borderWidth: 8,
        borderColor: tipColor
    },
    tipBubbleBig: {
        width: 280,
        height: 145,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tipColor,
        borderRadius: 15,
        borderWidth: 8,
        borderColor: tipColor
    },
    tipBubbleSmallest: {
        width: 280,
        height: 95,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tipColor,
        borderRadius: 15,
        borderWidth: 8,
        borderColor: tipColor
    },
    tipBubbleSmaller: {
        width: 280,
        height: 115,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tipColor,
        borderRadius: 15,
        borderWidth: 8,
        borderColor: tipColor
    },
    mainTipText: {
        fontSize: 15,
        color: secondaryColor
    },
    continue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FADE4F"
    },
    stopTips: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#B7B7B7"
    },
    cameraColumn: {
        flex: 1 / 3,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center"
    }
>>>>>>> 32093e505989c0bac14f866f098b23553b7e6f89
}));
