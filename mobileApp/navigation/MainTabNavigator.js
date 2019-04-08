import React from "react";
import { StatusBar, View, SafeAreaView, ScrollView, Image } from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation";

// List of Screen Imports that should be in the Main Stack
// Login related screens should NOT got here
import HomeScreen from "../screens/HomeScreen";
import History from "../screens/History";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutUs from "../screens/AboutUs";
// import ReportDetail from "../screens/ReportDetail";

const CustomDrawerComponent = props => (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <View
            style={{
                height: 150,
                backgroundColor: "#CCC",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {/* Image that appears at the top of the Side Drawer */}
            <Image
                source={require("../assets/images/SCPD_Logo.png")}
                style={{ width: 120, height: 120 }}
            />
        </View>
        <ScrollView style={{ backgroundColor: "#CCC" }}>
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
        AboutUs: AboutUs
        // ReportDetail: ReportDetail
    },
    {
        contentComponent: CustomDrawerComponent,
        contentOptions: {
            activeTintColor: "white",
            activeBackgroundColor: "#336",
            backgroundColor: "#CCC"
        }
    }
);
