import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
import { Text, Label, Item, Input, Button, Icon } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'
import SelectMultiple from 'react-native-select-multiple'
import Collapsible from 'react-native-collapsible';

export default class EditTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            tripKey: this.props.tripKey,
            newTripName: '',
            newTripDescription: '',
            newTripBudget: 0,
            selectedCurrencies: [],
            selectedCurrency: '',
            currenciesArray: [],
            currenciesModal: false,
        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => {
                    this.setEditTripDialog(false)
                }}
                style={{
                    width: 350,
                    height: 'auto',
                    padding: 16
                }}
                visible={this.state.dialog}>
                <ScrollView>
                    <Text style={{ marginBottom: 16 }}>Edit trip</Text>
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
                    <View style={styles.splitTextContainer}>
                        <Text style={{ marginTop: 3, marginLeft: 6, width: '80%' }}>
                            {this.currenciesString(this.state.selectedCurrencies)}
                        </Text>
                        <Icon
                            onPress={() => this.setCurrenciesModal(true)}
                            style={{ color: '#5067FF', marginLeft: 12 }}
                            android="md-create"
                            ios="ios-create">
                        </Icon>
                    </View>
                    <Label style={{ width: '100%' }}>Budget</Label>
                    <View style={styles.splitTextContainer}>
                        <Picker
                            style={{ width: 85 }}
                            selectedValue={this.state.selectedCurrency}
                            onValueChange={(itemvalue, itemIndex) => {
                                this.setState({
                                    newTripBudget: 
                                    stateStore.amountToCurrency(
                                        itemvalue,
                                        stateStore.amountToEuro(this.state.selectedCurrency,this.state.newTripBudget)),
                                    selectedCurrency: itemvalue
                                })
                            }}>
                            {this.state.selectedCurrencies.map(currency => (
                                <Picker.Item key={currency.value} label={currency.value} value={currency.value} />
                            ))}
                        </Picker>
                        <Input
                            style={{ flex: 1, borderBottomWidth: 0.5 }}
                            value={this.state.newTripBudget.toString()}
                            keyboardType='numeric'
                            selectionColor="#5067FF"
                            onChangeText={(budget) => {
                                this.setState({
                                    newTripBudget: budget.replace(",", ".")
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
                                selectedItems={this.state.selectedCurrencies.slice()}
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
                        <Button transparent small onPress={() => this.setEditTripDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.editTrip()}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ScrollView>
            </ModalWrapper>
        )
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
    componentWillMount() {
        const trip = stateStore.getTrip(this.props.tripKey)
        const budget = stateStore.amountToCurrency(trip.selectedCurrency, trip.budget)
        this.setState({
            newTripName: trip.name,
            newTripDescription: trip.description,
            newTripBudget: budget,
            selectedCurrencies: trip.currencies,
            currenciesArray: stateStore.currencies.keys(),
            selectedCurrency: trip.selectedCurrency
        })
    }
    setEditTripDialog(visible) {
        this.setState({ dialog: visible })
    }
    editTrip() {
        const trip = {
            name: this.state.newTripName,
            description: this.state.newTripDescription,
            budget: this.state.newTripBudget,
            currencies: this.state.selectedCurrencies,
            selectedCurrency: this.state.selectedCurrency
        }
        if (trip.name && trip.description && trip.budget && trip.currencies.length != 0 && trip.selectedCurrency && !isNaN(trip.budget)) {
            if (this.checkEventCurrencies().length == 0) {
                stateStore.editTrip(this.props.tripKey, trip)
                this.setEditTripDialog(false)
            }
            else {
                let text = "There are still events with these currencies: "
                for (let currency of this.checkEventCurrencies()) {
                    text = text + "-" + currency
                }
                Alert.alert('Warning', text)
            }
        } else {
            Alert.alert('Field missing', 'Every field must be filled in!', [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                }
            ], { cancelable: false })
        }
    }
    //checks that the currencies you used in your events are still "selected" -> otherwise there will be inconsistencies
    checkEventCurrencies() {
        let array = []
        for (let event of stateStore.getEvents(this.props.tripKey)) {
            let currency = event.currency
            let bool = false
            for (let selectedCurrency of this.state.selectedCurrencies) {
                if (currency == selectedCurrency.value) {
                    bool = true
                }
            }
            if (bool == false) {
                array.push(currency)
            }
        }
        return array
    }
    /* checkSelectedCurrency() {
        let bool = false
        for (let selectedCurrency of this.state.selectedCurrencies) {
            if (this.state.selectedCurrency == selectedCurrency.value) {
                bool = true
            }
        }
        return bool
    } */
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