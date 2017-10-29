import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, Button} from 'react-native'
import {firebaseApp} from '../firebaseconfig'
import {StackNavigator} from 'react-navigation';


export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            error: null,
            loading: false
        }
    }
    static navigationOptions = {
        title: 'Login/Register'
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Login / Register
                </Text>
                <Text>
                    {this.state.error&&this.state.error.message}
                </Text>
                <TextInput
                    placeholder="Username"
                    onChangeText={(username) => this.setState({username})}
                    style={styles.input}/>
                <TextInput
                    placeholder="Password"
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry
                    style={styles.input}/>
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button 
                            
                            title="Login" 
                            onPress={() => this.onLogin()} 
                        />
                    </View>
                    <View style={styles.button}>
                        <Button 
                            
                            title="Register" 
                            onPress={() => this.onRegister()} 
                        />
                    </View>
                </View>
            </View>
        )
    }
    isLoginValid() {
        const {username, password} = this.state
        return (username !== '' && password !== '')
    }
    onLogin() {
        const {username, password} = this.state
        if(this.isLoginValid){
            firebaseApp.auth().signInWithEmailAndPassword(`${username}@costsplitter.com`,password)
            .then(data => {
                this.navigate('Overview')
            }).catch(error => {
                this.setState({
                    error: error
                })
            })
        }
    }
    onRegister() {
        const {username, password} = this.state
        if(this.isLoginValid){
            firebaseApp.auth().createUserWithEmailAndPassword(`${username}@costsplitter.com`,password)
            .then((data) => {
                this.navigate('Home')
                firebaseApp.database().ref(`users/${data.uid}`).set({
                    email: `${username}@costsplitter.com`,
                    username: username,
                    events: 0
                })
            }).catch((error) => {
                this.setState({
                    error: error
                })
            })
        }
    }
    navigate(route) {
        const {navigate} = this.props.navigation
        navigate(route)
    }
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1

    },
    input: {
        minWidth: 200
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
       margin: 5
    }
});