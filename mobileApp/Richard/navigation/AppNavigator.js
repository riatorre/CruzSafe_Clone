import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import WelcomeScreen from "../screens/WelcomeScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";

const AppStack = MainTabNavigator;
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
