import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator
} from "react-navigation";

//Main App
import MainTabNavigator from "../navigation/MainTabNavigator";
// Screen for Authentication
import WelcomeScreen from "../screens/WelcomeScreen";
import ReportDetail from "../screens/ReportDetail";
import ReportScreen from "../screens/ReportScreen";
import LocationScreen from "../screens/LocationScreen";
import CameraScreen from "../screens/CameraScreen";
import ImageView from "../screens/ImageView";
import VideoPlay from "../screens/VideoPlay";
import Swiper from "../screens/Swiper";

// Screen for determining if (Re-)Authentication is needed
import AuthLoadingScreen from "../screens/AuthLoadingScreen";

// The Main App. Edit MainTabNavigator if you wish to add more screens to Main App
const AppStack = createStackNavigator(
    {
        Main: MainTabNavigator,
        Report: ReportScreen,
        Location: LocationScreen,
        Camera: CameraScreen,
        ReportDetail: ReportDetail,
        ImageView: ImageView,
        VideoPlay: VideoPlay,
        Swiper: Swiper
    },
    { headerMode: "none" }
);
// The Authentication Portion of the App.
const AuthStack = createStackNavigator(
    { Welcome: WelcomeScreen },
    { headerMode: "none" }
);

//will contain boolean of tutorialmode and what pages we've seen
export var tutorialParams = { tutorialMode: false };

export default createAppContainer(
    createSwitchNavigator(
        {
            // You could add another route here for authentication.
            // Read more at https://reactnavigation.org/docs/en/auth-flow.html
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRouteName: "AuthLoading"
        }
    )
);
