import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
import { Text, Label, Item, Input, Button, Icon } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'
import SelectMultiple from 'react-native-select-multiple'
import Collapsible from 'react-native-collapsible';


export default class AddTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            newTripName: '',
            newTripDescription: '',
            newTripBudget: 0,
            selectedCurrencies: [{ label: 'EUR', value: 'EUR' }],
            selectedCurrency: 'EUR',
            currenciesModal: false,
            currenciesArray: []
        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => { this.setAddTripDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <ScrollView>
                    <Text style={{ marginBottom: 16 }}>Add trip</Text>
                    <Item floatingLabel style={{ marginBottom: 16 }}>
                        <Label>Name</Label>
                        <Input
                            value={this.state.newTripName}
                            selectionColor="#5067FF"
                            onChangeText={(name) => {
                                this.setState({
                                    newTripName: name
                                })
                            }}
                            autoFocus={true} />
                    </Item>
                    <Item floatingLabel style={{ marginBottom: 16 }}>
                        <Label>Description</Label>
                        <Input
                            value={this.state.newTripDescription}
                            selectionColor="#5067FF"
                            onChangeText={(description) => {
                                this.setState({
                                    newTripDescription: description
                                })
                            }}
                            autoFocus={false} />
                    </Item>
                    <Label>Currencies</Label>
                    <View  style={styles.splitTextContainer}>
                        <Text style={{marginTop:3, marginLeft:6, width:'80%'}}>
                            {this.currenciesString(this.state.selectedCurrencies)}
                        </Text>
                        <Icon
                            onPress={() => this.setCurrenciesModal(true)}
                            style={{ color: '#5067FF', marginLeft:12 }}
                            android="md-create"
                            ios="ios-create">
                        </Icon>
                    </View>
                    <Label style= {{width: '100%'}}>Budget</Label>
                    <View style={styles.splitTextContainer}>
                        <Picker 
                            style={{width:85}}
                            selectedValue={this.state.selectedCurrency} 
                            onValueChange={(itemvalue, itemIndex) => {
                                this.setState({
                                    selectedCurrency: itemvalue
                                })
                        }}>
                            {this.state.selectedCurrencies.map(currency => (
                                <Picker.Item key={currency.value} label={currency.value} value={currency.value} />
                            ))}
                        </Picker>
                            <Input
                                style={{flex:1, borderBottomWidth:0.5 }}
                                value={this.state.newTripBudget.toString()}
                                keyboardType='numeric'
                                selectionColor="#5067FF"
                                onChangeText={(budget) => {
                                    this.setState({
                                        newTripBudget: budget
                                    })
                                }}
                                autoFocus={false} />

                    </View>

                    <ModalWrapper
                        visible={this.state.currenciesModal}
                        style={{ width: 350, height: 'auto', padding: 16 }}
                        onRequestClose={() => this.setCurrenciesModal(false)}>
                        <View>
                            <Text>Choose relevant currencies</Text>
                            <SelectMultiple
                                items={this.state.currenciesArray.sort()}
                                selectedItems={this.state.selectedCurrencies}
                                onSelectionsChange={this.onSelectionsChange}
                                style={{ height: 400 }} />
                            <Text>Selected: {this.state.selectedCurrencies.map(currency => (
                                " " + currency.value
                            ))}
                            </Text>
                            <View style={styles.buttonContainer}>
                                <Button transparent small onPress={() => { this.setCurrenciesModal(false) }}>
                                    <Text style={{ color: '#5067FF' }}>Cancel</Text>
                                </Button>
                                <Button primary small onPress={() => { this.setCurrenciesModal(false) }}>
                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                </Button>
                            </View>
                        </View>
                    </ModalWrapper>
                    <View style={styles.buttonContainer}>
                        <Button transparent small onPress={() => this.setAddTripDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.addTrip()}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ScrollView>
            </ModalWrapper>
        )
    }
    componentWillMount() {
        this.setState({
            currenciesArray: stateStore.currencies.keys()
        })
    }
    currenciesString(currencies){
        let string = ""
        currencies.forEach(currency => {
            string += `${currency.value} `
        });
        return string
    }

    //currencies
    onSelectionsChange = (selectedCurrencies) => {
        this.setState({ selectedCurrencies })
    }
    setCurrenciesModal(visible) {
        this.setState({
            currenciesModal: visible
        })
    }
    setAddTripDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    addTrip() {
        const trip = {
            name: this.state.newTripName,
            description: this.state.newTripDescription,
            budget: this.state.newTripBudget,
            currencies: this.state.selectedCurrencies,
            selectedCurrency: this.state.selectedCurrency

        }
        if (trip.name && trip.description && trip.budget && trip.currencies.length && trip.selectedCurrency && !isNaN(trip.budget)) {

            stateStore.addTrip(trip)
            this.setAddTripDialog(false)
            this.setState({
                newTripName: '',
                newTripDescription: '',
                newTripBudget: '',
                selectedCurrencies:  [{ label: 'EUR', value: 'EUR' }],
                selectedCurrency: 'EUR'
            })
        }
        else {
            Alert.alert(
                'Field missing',
                'Every field must be filled in!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        }
    }
}
const styles = StyleSheet.create({

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    splitTextContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',

    }
});