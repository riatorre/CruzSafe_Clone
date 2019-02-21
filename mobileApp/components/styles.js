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
        backgroundColor: "#336"
    },
    header_modal: {
        backgroundColor: "#336"
    },
    footer: {
        backgroundColor: "#336"
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
        backgroundColor: "#336"
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
        backgroundColor: "#336",
        borderColor: "#D4AF37",
        borderWidth: 0.5,
        borderRadius: 10
    }
}));
