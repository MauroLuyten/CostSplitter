import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {StackNavigator} from 'react-navigation';
import {observer} from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
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
        return stateStore.user
            ? `Logged in as: ${stateStore.user.uid}`
            : 'Not logged in'
    }
    loggedIn() {
        return stateStore.user
    }
    logout() {
        stateStore.logout()
        this.navigate('Login')
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