/*
 * styles.js
 * Essentially just a stylesheet for App
 */

import { StatusBar, StyleSheet, AsyncStorage } from "react-native";

var darktheme = true;

export default (styles = StyleSheet.create({
    drawerImgContainer: {
        height: 150,
        backgroundColor: darktheme ? "#113F67" : "#CCC",
        alignItems: "center",
        justifyContent: "center"
    },
    drawerScrollViewBackground: {
        backgroundColor: darktheme ? "#113F67" : "#CCC"
    },
    container: {
        flex: 1,
        backgroundColor: darktheme ? "#113F67" : "#CCC",
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
        color: darktheme ? "#195A8E" : "silver",
        marginLeft: 10
    },
    header_text: {
        color: darktheme ? "#195A8E" : "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    footer_text: {
        color: darktheme ? "#195A8E" : "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    traffic_light: {
        backgroundColor: "#333",
        padding: 10
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
        backgroundColor: darktheme ? "#113F67" : "#303060",
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
    selectionLocation: {
        zIndex: 2,
        top: 15,
        height: 0
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
        borderBottomColor: "#AA94FF",
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    descriptionLocation: {
        zIndex: 2,
        top: 15,
        height: 0
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
        borderBottomColor: "#AA94FF",
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    locationLocation: {
        zIndex: 2,
        top: 15,
        height: 0
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
        borderBottomColor: "#AA94FF",
        borderLeftWidth: 9,
        borderLeftColor: "transparent"
    },
    cameraLocation: {
        zIndex: 2,
        top: -155,
        height: 0
    },
    cameraTriangle1: {
        position: "absolute",
        left: 61,
        top: 140,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    cameraTriangle2: {
        position: "absolute",
        left: 207,
        top: 140,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    mapLocation: {
        zIndex: 2,
        top: -100,
        height: 0
    },
    mapTriangle: {
        position: "absolute",
        left: 135,
        top: 90,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    submissionLocation: {
        zIndex: 2,
        top: -133,
        height: 0
    },
    submissionTriangle1: {
        position: "absolute",
        left: 61,
        top: 118,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    submissionTriangle2: {
        position: "absolute",
        left: 207,
        top: 118,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    thumbnailLocation: {
        zIndex: 2,
        top: -76,
        height: 0
    },
    thumbnailTriangle: {
        position: "absolute",
        left: 134,
        top: 90,
        width: 3,
        height: 3,
        borderRightColor: "transparent",
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderTopColor: "#AA94FF",
        borderLeftWidth: 10,
        borderLeftColor: "transparent"
    },
    tipBubbleSquare: {
        width: 290,
        height: 105,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1C7F9",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#AA94FF"
    },
    tipBubbleBig: {
        width: 290,
        height: 120,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1C7F9",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#AA94FF"
    },
    tipBubbleBigger: {
        width: 290,
        height: 140,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1C7F9",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#AA94FF"
    },
    tipBubbleSmaller: {
        width: 290,
        height: 90,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1C7F9",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#AA94FF"
    },
    mainTipText: {
        fontSize: 15
    },
    continue: {
        fontSize: 22
    },
    stopTips: {
        fontSize: 12
    }
}));
