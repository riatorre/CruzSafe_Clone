import React from "react";
import {
    StatusBar,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    Platform
} from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation";

// List of Screen Imports that should be in the Main Stack
// Login related screens should NOT got here
import HomeScreen from "../screens/HomeScreen";
import History from "../screens/History";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutUs from "../screens/AboutUs";
import Feedback from "../screens/FeedbackScreen";

import styles from "../components/styles.js";

var darktheme = true;

const CustomDrawerComponent = props => (
    <SafeAreaView
        style={{
            flex: 1,
            marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight
        }}
    >
        <View style={styles.drawerImgContainer}>
            {/* Image that appears at the top of the Side Drawer */}
            <Image
                source={require("../assets/images/CruzSafe.png")}
                style={{ width: 200, height: 200 }}
            />
        </View>
        <ScrollView style={styles.drawerScrollViewBackground}>
            {/* Where all of the screen navigation buttons appear (Inserted under comment below). Should be scrollable if
                enough screens exist
            */}
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
);

export default createDrawerNavigator(
    {
        // Place all Screens. They will all appear in the Side Drawer
        Home: HomeScreen,
        History: History,
        Links: LinksScreen,
        Settings: SettingsScreen,
        AboutUs: AboutUs,
        Feedback: Feedback
    },
    {
        contentComponent: CustomDrawerComponent,
        contentOptions: {
            activeTintColor: "#2384BC",
            activeBackgroundColor: darktheme ? "white" : "#336",
            backgroundColor: darktheme ? "#113F67" : "#CCC",
            labelStyle: styles.drawerText
        }
    }
);
