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
    padding: 5
  },
  picker_view: {
    margin: 5,
    width: "80%",
    backgroundColor: "#EEE",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
}));
