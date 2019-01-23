// SignInScreen.js

import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, AsyncStorage } from 'react-native'

export default class Login extends React.Component {
	state = { name: '', errorMessage: null}
    static navigationOptions = {
		title: 'Sign In',
	};

  render() {
	const isDisabled = this.state.name.length === 0;
    return (
      <View style={styles.container}>
		<TextInput
			style={styles.textInput}
			autoCapitalize='none'
			placeholder='Name'
			onChangeText={name=>this.setState({name})}
			value={this.state.name}
		/>
        <Button title="Sign in!" disabled={isDisabled} onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
	await AsyncStorage.setItem('userToken', this.state.name);
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