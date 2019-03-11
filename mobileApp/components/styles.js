/*
 * styles.js
 * Essentially just a stylesheet for App
 */

import { StatusBar, StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#CCC",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: "#303060"
    },
    header_image: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        shadowColor: "black",
        borderBottomWidth: 0
    },
    header_modal: {
        backgroundColor: "#303060"
    },
    footer: {
        backgroundColor: "#303060"
    },
    icon: {
        color: "silver",
        marginLeft: 10
    },
    header_text: {
        color: "white",
        fontSize: 20
    },
    footer_text: {
        color: "white",
        fontSize: 20
    },
    traffic_light: {
        backgroundColor: "#333",
        padding: 10
    },
    textInput: {
        margin: 5,
        padding: 5,
        width: "80%",
        backgroundColor: "#EEE",
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 8
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
        margin: 5,
        padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        borderRadius: 125,
        backgroundColor: "#303060"
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
        marginRight: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEE",
        borderColor: "gray",
        borderWidth: 1
    },
    itemContainer: {
        flex: 1,
        padding: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#4488A7"
    },
    reportBtn: {
        flex: 1,
        padding: 10,
        backgroundColor: "#303060",
        borderColor: "#D4AF37",
        borderWidth: 0.5,
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
        fontSize: 11.5
    },
    slideText7: {
        fontSize: 13
    },
    slide1: {
        padding: 10,
        backgroundColor: "rgba(20,20,200,0.2)"
    },
    slide2: {
        padding: 10,
        backgroundColor: "rgba(20,200,20,0.2)"
    },
    slide3: {
        padding: 10,
        backgroundColor: "rgba(200,20,20,0.2)"
    },
    slide4: {
        padding: 10,
        backgroundColor: "rgba(20,20,200,0.2)"
    },
    slide5: {
        padding: 10,
        backgroundColor: "rgba(200,20,20,0.2)"
    },
    slide6: {
        padding: 10,
        backgroundColor: "rgba(20,200,20,0.2)"
    },
    slide7: {
        padding: 10,
        backgroundColor: "rgba(20,20,200,0.2)"
    },
    slide8: {
        padding: 10,
        backgroundColor: "rgba(20,200,20,0.2)"
    },
    slide9: {
        padding: 10,
        backgroundColor: "rgba(200,20,20,0.2)"
    },
    slide10: {
        padding: 10,
        backgroundColor: "rgba(20,20,200,0.2)"
    }
}));
