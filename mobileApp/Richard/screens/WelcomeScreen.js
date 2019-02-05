import React, {Component} from 'react';
import {StatusBar, Text, StyleSheet, SafeAreaView, Image, View,TextInput, Button, AsyncStorage} from 'react-native';
import {Container, Header, Content, Footer, Icon} from 'native-base';
import Swiper from 'react-native-swiper';

class WelcomeScreen extends Component{
	state = { username: '', errorMessage: null}
	
	render(){
		
		const isDisabled = this.state.username.length === 0;
		return (
			<SafeAreaView style={{flex:1}}>
				<Swiper showsButtons={true} loop={false} showsPagination={false}>
					<Container>
						<Header style={styles.header}></Header>
						<Content contentContainerStyle={styles.container}>
							<Text style={{fontSize:36}}>Welcome to</Text>
							<Image source={require('../assets/images/SCPD_Logo.png')} style={{width:200, height:200}}/>
							<Text style={{fontSize:36}}>CruzSafe!</Text>
						</Content>
						<Footer style={styles.footer}></Footer>
					</Container>
					<Container>
						<Header style={styles.header}></Header>
						<Content contentContainerStyle={styles.container}>
							<Text style={{fontSize:24}}>Please enter a name</Text>
							<TextInput
							style={styles.textInput}
							autoCapitalize='none'
							placeholder='Name'
							onChangeText={username=>this.setState({username})}
							value={this.state.username}
							/>
							<Button title="Sign in!" disabled={isDisabled} onPress={this._signInAsync} />
						</Content>
						<Footer style={styles.footer}></Footer>
					</Container>
				</Swiper>
			</SafeAreaView>
		);
	}
	
	_signInAsync = async () => {
	await AsyncStorage.setItem('userToken', this.state.username);
	this.props.navigation.navigate('App');
  };
}
export default WelcomeScreen;

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
  textInput: {
	margin: 5,
	padding: 5,
    height: 40,
    width: '80%',
	backgroundColor: '#EEE',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  }
});