import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, Button} from 'react-native'

export default class LoginScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: ''
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
                <TextInput
                    placeholder="Username"
                    onChangeText={(username) =>this.setState({username})}
                    style={styles.input}
                />
                <TextInput 
                    placeholder="Password"
                    onChangeText={(password) =>this.setState({password})}
                    style={styles.input}
                />
                <Button
                    title="Login"
                    onPress={()=>{}}
                    style={styles.input}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1
        
    },
    input: {
        minWidth: 200
    }
});