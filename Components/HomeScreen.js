import React, {Component} from 'react'
import {View, StyleSheet, NetInfo} from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import {StackNavigator} from 'react-navigation'
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
        headerStyle: { backgroundColor: '#bac2ff'},
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <Container>
                <Content>
                    <Text>{this.getConnectivity()}</Text>
                    <Text style={styles.status}>
                        {this.authText()}
                    </Text>
                    <View>
                        <Grid>
                        {this.loggedIn()
                            ? (<Row><Col><Button rounded style={styles.button} onPress={() => this.logout()}><Text style={styles.buttonText}>Logout</Text></Button></Col></Row>)
                            : (<Row><Col><Button rounded style={styles.button} onPress={() => navigate('Login')}><Text style={styles.buttonText}>Login</Text></Button></Col></Row>)
                        } 
                        <Row><Col><Button rounded style={styles.button} onPress={() => navigate('Overview')}><Text style={styles.buttonText}>Overview</Text></Button></Col></Row>
                        <Row><Col><Button rounded style={styles.button} onPress={() => navigate('Currency')}><Text style={styles.buttonText}>Currencies</Text></Button></Col></Row>
                        <Row><Col><Button rounded style={styles.button} onPress={() => navigate('Summaries')}><Text style={styles.buttonText}>Summaries</Text></Button></Col></Row>
                        <Row><Col><Button rounded style={styles.button} onPress={() => stateStore.clearTrips()}><Text style={styles.buttonText}>Clear</Text></Button></Col></Row>
                        </Grid>
                    </View>
                </Content>
            </Container>
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
    status: {
        fontSize: 30,
        textAlign: 'center'
    },
    button: {
        marginTop: 20,
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 20,
    },
});