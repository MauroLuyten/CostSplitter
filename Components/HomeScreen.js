import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import {StackNavigator} from 'react-navigation';
export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home'
    }
    render(){
        const {navigate} = this.props.navigation
        return (
            <View>
                <Text>
                    Test
                </Text>
                <Button
                    title="Login"
                    onPress={()=>navigate('Login')}
                />
            </View>
        )
    }
}