import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

//Main App
import MainTabNavigator from "./MainTabNavigator";
// Screen for Authentication
import WelcomeScreen from "../screens/WelcomeScreen";
import ReportDetail from "../screens/ReportDetail";
import History from "../screens/History";

// Screen for determining if (Re-)Authentication is needed
import AuthLoadingScreen from "../screens/AuthLoadingScreen";

// The Main App. Edit MainTabNavigator if you wish to add more screens to Main App
const AppStack = MainTabNavigator;
// The Authentication Portion of the App.
const AuthStack = createStackNavigator(
  { Welcome: WelcomeScreen },
  { ReportDetail: ReportDetail },
  { History: History },
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
