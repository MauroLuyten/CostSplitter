import React, {Component} from 'react'
import {View, Text, Button, StyleSheet, TouchableOpacity, NetInfo} from 'react-native'
import {StackNavigator} from 'react-navigation';
import {observer} from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            connectivity: "No internet connection"
        }
        
    }
    static navigationOptions = {
        title: 'Home',
        headerTitleStyle: { alignSelf: 'center'},
        headerStyle: { backgroundColor: '#DEEFF5'},
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <View style={styles.container}>
            <Text>{this.getConnectivity()}</Text>
                <Text style={styles.status}>
                    {this.authText()}
                </Text>
                <View style={styles.container2}>
                    {this.loggedIn()
                        ? (<View style={styles.button}><Button title="Logout" onPress={() => this.logout()}/></View>)
                        : (<View style={styles.button}><Button title="Login" onPress={() => navigate('Login')}/></View>)}
                    <View style={styles.button}>
                        <Button title="Overview" onPress={() => navigate('Overview')}/>
                    </View>
                </View>
                <TouchableOpacity>
                    </TouchableOpacity>
            </View>
        )
    }
    componentWillMount() {
        this.check_internet_connection()   
    }
    componentDidMount() {
        setInterval(() => {
            this.check_internet_connection()
        }, 5000);
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
    check_internet_connection() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected)
            {
                this.setState( {
                    connectivity: "Internet connection"
                })
            }
            else {
                this.setState({
                    connectivity: "No internet connection"
                })
            }
        });
    }
    getConnectivity() {
        return this.state.connectivity
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    container2: {
        backgroundColor: '#A5FCFF',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        padding: 10
    },
    status: {
        fontSize: 20,
        textAlign: 'center'
    }
});