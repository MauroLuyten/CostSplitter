import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {StackNavigator} from 'react-navigation';
export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home'
    }
    render(){
        const {navigate} = this.props.navigation
        return (
            <View style={styles.container}>
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
const styles = StyleSheet.create({
    container: {
        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1
        
    },
});