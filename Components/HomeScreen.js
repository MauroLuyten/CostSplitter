import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {StackNavigator} from 'react-navigation';
import {firebaseApp} from '../firebaseconfig'
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
    }
    static navigationOptions = {
        title: 'Home'
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <View style={styles.container}>
                <Text>
                    {this.authText()}
                </Text>
                {this.loggedIn()
                    ? (<Button title="Logout" onPress={() => this.logout()}/>)
                    : (<Button title="Login" onPress={() => navigate('Login')}/>)}
                <Button title="Overview" onPress={() => navigate('Overview')}/>
            </View>
        )
    }
    authText() {
        let uid = firebaseApp
            .auth()
            .currentUser
        return uid
            ? `Logged in as: ${uid.uid}`
            : 'Not logged in'
    }
    loggedIn() {
        return firebaseApp.auth().currentUser!=null
    }
    logout() {
        firebaseApp
            .auth()
            .signOut()
            .then(result => {
                this.navigate('Login')
            })
            .catch(error => {})
    }
    navigate(route) {
        const {navigate} = this.props.navigation
        navigate(route)
    }
}
const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1

    }
});