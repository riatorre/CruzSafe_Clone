import React from 'react';
import { StatusBar, View, SafeAreaView, ScrollView, Image } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const CustomDrawerComponent = (props) => (
	<SafeAreaView style={{flex: 1,marginTop:StatusBar.currentHeight}}>
		<View style={{height: 150,backgroundColor:'#CCC', alignItems: 'center', justifyContent: 'center'}}>
			<Image source={require('../assets/images/SCPD_Logo.png')} style={{width: 100, height:120}}/>
		</View>
		<ScrollView style={{backgroundColor:'#CCC'}}>
			<DrawerItems {...props}/>
		</ScrollView>
	</SafeAreaView>
)

export default createDrawerNavigator({
	Home:HomeScreen,
	Links:LinksScreen,
	Settings:SettingsScreen
},{
	contentComponent: CustomDrawerComponent,
	contentOptions:{
		activeTintColor: 'white',
		activeBackgroundColor: '#336',
		backgroundColor: '#CCC'
	}
});
