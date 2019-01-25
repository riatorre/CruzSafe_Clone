// SignInScreen.js

import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, AsyncStorage, SafeAreaView } from 'react-native'

export default class Login extends React.Component {
	state = { username: '', errorMessage: null}
    static navigationOptions = {
		title: 'Sign In',
	};

	render() {
		const isDisabled = this.state.username.length === 0;
		return (
			<SafeAreaView style={{flex:1}}>
				<View style={styles.container}>
					<TextInput
						style={styles.textInput}
						autoCapitalize='none'
						placeholder='Name'
						onChangeText={username=>this.setState({username})}
						value={this.state.username}
					/>
					<Button title="Sign in!" disabled={isDisabled} onPress={this._signInAsync} />
				</View>
			</SafeAreaView>
		);
	}

  _signInAsync = async () => {
	await AsyncStorage.setItem('userToken', this.state.username);
	this.props.navigation.navigate('App');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
	margin: 5,
	padding: 5,
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  }
})