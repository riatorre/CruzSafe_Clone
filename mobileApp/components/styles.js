/*
 * styles.js
 * Essentially just a stylesheet for App
 */

import { StatusBar, StyleSheet, AsyncStorage } from "react-native";

var darktheme = true;

export default (styles = StyleSheet.create({
    drawerImgContainer: {
        height: 150,
        backgroundColor: darktheme ? "#2384BC" : "#CCC",
        alignItems: "center",
        justifyContent: "center"
    },
    drawerScrollViewBackground: {
        backgroundColor: darktheme ? "#2384BC" : "#CCC"
    },
    container: {
        flex: 1,
        backgroundColor: darktheme ? "#2384BC" : "#CCC",
        alignItems: "center",
        justifyContent: "center"
    },
    reportContainer: {
        flex: 0.95,
        justifyContent: "center",
        width: "90%",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#FFFFFF80"
    },
    reportBtnFull: {
        marginTop: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E8E5E5",
        borderRadius: 10
    },
    reportBtnHalf: {
        marginTop: 5,
        padding: 5,
        flex: 0.49,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E8E5E5",
        borderRadius: 10
    },
    reportBtnCancel: {
        marginTop: 5,
        padding: 5,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F26860"
    },
    reportBtnSubmit: {
        marginTop: 5,
        padding: 5,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7BCC53"
    },
    header: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: darktheme ? "black" : "#303060"
    },
    header_image: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        shadowColor: "black",
        borderBottomWidth: 0
    },
    header_modal: {
        backgroundColor: darktheme ? "black" : "#303060"
    },
    footer: {
        backgroundColor: darktheme ? "black" : "#303060"
    },
    icon: {
        color: darktheme ? "#2384BC" : "silver",
        marginLeft: 10
    },
    header_text: {
        color: darktheme ? "#2384BC" : "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    footer_text: {
        color: darktheme ? "#2384BC" : "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    traffic_light_background: {
        width: 340.33332,
        height: 400,
        alignItems: "center"
    },
    trafficLightContainer: {
        justifyContent: "center",
        width: 270,
        height: 360,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFF40"
    },
    textContainer: {
        justifyContent: "center",
        width: 400,
        height: 70,
        marginTop: 40,
        padding: 4,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFF40"
    },
    textInput: {
        margin: 1,
        padding: 5,
        backgroundColor: "#EEE",
        borderRadius: 5
    },
    textInputWelcome: {
        width: "90%",
        margin: 1,
        padding: 5,
        backgroundColor: "#EEE",
        borderRadius: 5
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
        backgroundColor: darktheme ? "black" : "#303060"
    },
    btnTextWhite: {
        color: "white"
    },
    btnTextBlack: {
        color: "black"
    },
    signinBtn: {
        margin: 1,
        padding: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: "black",
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
        marginLeft: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#EEE",
        borderRadius: 5
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
        backgroundColor: "#FFFFFF80",
        borderRadius: 10
    },
    reportBtn: {
        flex: 1,
        padding: 10,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: darktheme ? "#2384BC" : "#303060",
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
    slideText: {
        fontSize: 16
    },
    slideText4: {
        fontSize: 13
    },
    slideText7: {
        fontSize: 15
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
    refreshBtn: {
        flex: 0.09,
        margin: 1,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#9BC378"
    },
    locationHidden: {
        position: "absolute",
        left: -1000,
        top: -1000
    },
    selectionLocationIOS: {
        zIndex: 2,
        top: 15,
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
        left: 240,
        top: -16,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 9,
        borderBottomWidth: 16,
        borderBottomColor: "#744CA8",
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
        borderBottomColor: "#744CA8",
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
        borderBottomColor: "#744CA8",
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    cameraLocationIOS: {
        zIndex: 2,
        top: -142,
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
        left: 61,
        top: 130,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#744CA8",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    cameraTriangle2: {
        position: "absolute",
        left: 200,
        top: 130,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#744CA8",
        borderLeftWidth: 10,
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
        borderTopColor: "#744CA8",
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
        borderTopColor: "#744CA8",
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
        borderTopColor: "#744CA8",
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
        borderTopColor: "#744CA8",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    tipBubbleSquare: {
        width: 280,
        height: 130,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#744CA8",
        borderRadius: 15,
        borderWidth: 8,
        borderColor: "#744CA8"
    },
    tipBubbleBig: {
        width: 280,
        height: 145,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#744CA8",
        borderRadius: 15,
        borderWidth: 8,
        borderColor: "#744CA8"
    },
    tipBubbleSmallest: {
        width: 280,
        height: 95,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#744CA8",
        borderRadius: 15,
        borderWidth: 8,
        borderColor: "#744CA8"
    },
    tipBubbleSmaller: {
        width: 280,
        height: 115,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#744CA8",
        borderRadius: 15,
        borderWidth: 8,
        borderColor: "#744CA8"
    },
    mainTipText: {
        fontSize: 15,
        color: "white"
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
    }
}));
