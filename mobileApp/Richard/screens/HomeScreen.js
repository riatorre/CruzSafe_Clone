import React, {Component} from 'react';
import {StatusBar, View, Text, StyleSheet, AsyncStorage, SafeAreaView, Image, TouchableOpacity, Linking, Platform} from 'react-native';
import {Container, Header, Content, Footer, Left, Right, Body, Icon} from 'native-base';

class HomeScreen extends Component{
	static navigationOptions = {
		drawerLabel: 'Home',
		drawerIcon : ({ tintColor}) => (
			<Icon name="home" style={{fontSize:24, color:tintColor}}/>
		)
	};
	
	render(){
		return (
			<SafeAreaView style={{flex:1}}>
				<Container>
					<Header style={styles.header}>
						<Left>
							<Icon name='menu' style={styles.icon} onPress={() =>this.props.navigation.openDrawer()} />
						</Left>
						<Body>
							<Text style={styles.header_text}>Home</Text>
						</Body>
						<Right />
					</Header>
					<Content contentContainerStyle={styles.container}>
						<View style={styles.traffic_light}>
						<TouchableOpacity
							style={{
								borderWidth:1,
								borderColor:'rgba(0,0,0,0.2)',
								alignItems:'center',
								justifyContent:'center',
								width:100,
								height:100,
								backgroundColor:'#f00',
								borderRadius:100,
								margin:5
							}}
							onPress={()=>{
								var url = Platform.OS === 'ios' ? 'telprompt:' : 'tel:'+"911";
								return Linking.canOpenURL(url).then(canOpen => {
									if(canOpen){
										return Linking.openURL(url).catch((err) => Promise.reject(err))
									}else{
										Promise.reject(new Error('invalid URL provided ${url}'));
									}
								});
							}}>
							<Text>Emergency</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderWidth:1,
								borderColor:'rgba(0,0,0,0.2)',
								alignItems:'center',
								justifyContent:'center',
								width:100,
								height:100,
								backgroundColor:'#ff0',
								borderRadius:100,
								margin:5
							}}
							onPress={()=>{
								var url = Platform.OS === 'ios' ? 'telprompt:' : 'tel:'+"8314592231";
								return Linking.canOpenURL(url).then(canOpen => {
									if(canOpen){
										return Linking.openURL(url).catch((err) => Promise.reject(err))
									}else{
										Promise.reject(new Error('invalid URL provided ${url}'));
									}
								});
							}}>
							<Text>Urgent</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderWidth:1,
								borderColor:'rgba(0,0,0,0.2)',
								alignItems:'center',
								justifyContent:'center',
								width:100,
								height:100,
								backgroundColor:'#0f0',
								borderRadius:100,
								margin:5
							}}
							onPress={() =>{console.log('Report has been selected')}}>
							<Text>Report</Text>
						</TouchableOpacity>
						</View>
					</Content>
					<Footer style={styles.footer}>
						<Left style={{flex:1, alignItems: 'center', justifyContent: 'center'}}/>
						<Body style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
							<Text style={styles.footer_text}>CruzSafe</Text>
						</Body>
						<Right style={{flex:1, alignItems: 'center', justifyContent: 'center'}}/>
					</Footer>
				</Container>
			</SafeAreaView>
		);
	}
	
	// Did not work for unknown reasons.
	// Left for revision later
	
	openLink = (url) =>{
		return Linking.canOpenURL(url).then(canOpen => {
			if(canOpen){
				return Linking.openURL(url).catch((err) => Promise.reject(err))
			}else{
				Promise.reject(new Error('invalid URL provided ${url}'));
			}
		});
	};
	
	_handleEmergency = () =>{
		this.openLink("${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}911")
	};
	
	_handleUrgent = () =>{
		this.openLink("${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}8314592231")
	};
	
	_handleReport = () =>{
		console.log('Report has been selected')
	};
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
	alignItems: 'center',
	justifyContent: 'center'
  },
  header: {
	height: 75,
	backgroundColor: '#336'
  },
  footer: {
	backgroundColor: '#336'
  },
  icon: {
	color: 'silver',
	marginLeft: 10,
	marginTop: StatusBar.currentHeight
  },
  header_text:{
	marginTop: StatusBar.currentHeight,
	color:'white',
	fontSize: 20
  },
  footer_text:{
	color:'white',
	fontSize: 20
  },
  traffic_light:{
	  backgroundColor: '#333',
	  padding: 10
  }
});
