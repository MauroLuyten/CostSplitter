import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, Button} from 'react-native'
import {StackNavigator} from 'react-navigation'
import { observer, inject } from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
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
    componentWillMount(){
        /* if(stateStore.user){
            this.navigate('Home')
        } */
    }
    isLoginValid() {
        const {username, password} = this.state
        return (username !== '' && password !== '')
    }
    onLogin() {
        const {username, password} = this.state
        if(this.isLoginValid){
            stateStore.login(username, password)
        }
        this.navigate('Home')
    }
    onRegister() {
        const {username, password} = this.state
        if(this.isLoginValid){
            stateStore.register(username, password)
        }
        this.navigate('Home')            
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