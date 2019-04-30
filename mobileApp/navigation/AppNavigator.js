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
import Swiper2 from "../screens/Swiper2";

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
        Swiper: Swiper,
        Swiper2: Swiper2
    },
    { headerMode: "none" }
);
// The Authentication Portion of the App.
const AuthStack = createStackNavigator(
    { Welcome: WelcomeScreen },
    { headerMode: "none" }
);

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
