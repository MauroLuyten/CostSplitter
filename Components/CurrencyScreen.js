import React, {Component} from 'react'
import {ActivityIndicator, ListView, View, StyleSheet, NetInfo} from 'react-native'
import {ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Picker } from 'native-base'
import {Col, Row, Grid } from 'react-native-easy-grid'
import {StackNavigator} from 'react-navigation'
import {observer} from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class CurrencyScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            connectivity: false,
            currencies: stateStore.currencies,
            selectedCurrency: 'EUR',
            isLoading: false,
            rates: null
        }
        
    }
    static navigationOptions = {
        title: 'Currencies',
        headerTitleStyle: { alignSelf: 'center'},
        headerStyle: { backgroundColor: '#bac2ff'},
    }
    render() {
        const {navigate} = this.props.navigation
        if(this.getConnectivity() === false){
            return (
                <Container>
                    <Content>
                        <View>
                            <Text style={styles.status}>You need an internet connection to use this feature</Text>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                </Content>
            </Container>
            )
        }
        else if (this.state.isLoading) {
            return (
            <Container>
                <Content>
                    <View>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </Content>
            </Container>
            );
          }
          else if (this.state.rates === null){
            return (
                <Container>
                    <Content>
                        <View>
                            <Text style={styles.status}>Currencies test</Text>
                            <Picker selectedValue={this.state.selectedCurrency} onValueChange={(value) => {this.setState({selectedCurrency: value})}}>
                            {this.state.currencies.map(function(currency, i){
                                return <Picker.Item key={i} label={currency} value={currency} />
                            })}
                            </Picker>
                            <Button primary onPress={() => this.getExchangeRate(this.state.selectedCurrency)}><Text>Get</Text></Button>
                        </View>
                    </Content>
                </Container>
            )
          }
        return (
            <Container>
                <Content>
                    <View>
                        <Text style={styles.status}>Currencies test</Text>
                        <Picker selectedValue={this.state.selectedCurrency} onValueChange={(value) => {this.setState({selectedCurrency: value})}}>
                        {this.state.currencies.map(function(currency, i){
                            return <Picker.Item key={i} label={currency} value={currency} />
                        })}
                        </Picker>
                        <Button primary onPress={() => this.getExchangeRate(this.state.selectedCurrency)}><Text>Get</Text></Button>
                        {this.state.rates.map(function(rate, i){
                            return <Text>{rate}</Text>
                        })}
                    </View>
                </Content>
            </Container>
        )
    }

    getExchangeRate(currency){
        this.setState({
            isLoading: true
        })
        return fetch('https://api.fixer.io/latest?base='+currency)
        .then((response) => response.json())
        .then((responseJson) => {
            let ratesArray = []
            Object.keys(responseJson.rates).map(function(keyName){
                let rate = "" + keyName + " - " + responseJson.rates[keyName]
                ratesArray.push(rate)
            })
          this.setState({
            isLoading: false,
            rates: ratesArray
          }, function() {
            // do something with new state
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    componentWillMount() {
        this.check_internet_connection()   
    }
    componentDidMount() {
        setInterval(() => {
            this.check_internet_connection()
        }, 5000);
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
                    connectivity: true
                })
            }
            else {
                this.setState({
                    connectivity: false
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