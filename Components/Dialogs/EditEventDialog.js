import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base'
import DatePicker from 'react-native-datepicker'
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class EditEventDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            tripKey: this.props.tripKey,
            eventKey: this.props.eventKey,
            newEventName: '',
            newEventDescription: '',
            newEventCategory: 'Overnight stay',
            newEventAmount: 0,
            newEventDate: '',
            currencies: [],
            selectedCurrency: ''
        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => { this.setEditEventDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <ScrollView>
                <Text style={{marginBottom:16}}>Edit Event</Text>
                <Item floatingLabel style={{marginBottom:16}}>
                    <Label>Name</Label>
                    <Input
                        value={this.state.newEventName}
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                            this.setState({
                                newEventName: name
                            })
                        }}
                        autoFocus={true} />
                </Item>
                <Item floatingLabel style={{marginBottom:16}}>
                    <Label>Description</Label>
                    <Input
                        value={this.state.newEventDescription}
                        selectionColor="#5067FF"
                        onChangeText={(description) => {
                            this.setState({
                                newEventDescription: description
                            })
                        }}
                        autoFocus={false} />
                </Item>

                <Label>Category</Label>
                <Picker onValueChange={(itemvalue, itemIndex) => this.setState({newEventCategory: itemvalue})} style={{marginBottom: 16}}
                        selectedValue={this.state.newEventCategory}>
                    <Picker.Item label="Overnight stay" value="Overnight stay"/>
                    <Picker.Item label="Transport" value="Transport"/>
                    <Picker.Item label="Activity" value="Activity"/>
                    <Picker.Item label="Food" value="Food"/>
                    <Picker.Item label="Misc." value="Misc."/>
                </Picker>
                <Label>Currency</Label>
                <Picker 
                    selectedValue={this.state.selectedCurrency} 
                    onValueChange={(itemvalue, itemIndex) => 
                        this.setState(
                            {   newEventAmount: stateStore.convertAmount(this.state.selectedCurrency, itemvalue, this.state.newEventAmount),
                                selectedCurrency: itemvalue}
                        )}>
                    {this.state.currencies.map(currency => (
                        <Picker.Item key={currency.label} label={currency.label} value={currency.value} />
                    ))}
                </Picker>

                <Item floatingLabel style={{marginBottom:16}}>
                    <Label>Amount</Label>
                    <Input
                        value={this.state.newEventAmount.toString()}
                        keyboardType='numeric'
                        selectionColor="#5067FF"
                        onChangeText={(amount) => {
                            this.setState({
                                newEventAmount: amount.replace(",", ".")
                            })
                        }}
                        autoFocus={false} />
                </Item>

                
                <Label>Date</Label>
                <DatePicker floatingLabel style={{ marginBottom: 16 }}
                  date={this.state.newEventDate}
                  mode="date"
                  placeholder="select date"
                  format="DD-MM-YYYY"
                  minDate="01-01-2000"
                  maxDate="01-02-2018"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {this.setState({newEventDate: date})}} />

                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setEditEventDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.editEvent()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
                </ScrollView>
            </ModalWrapper>
        )
    }

    componentWillMount(){
        const trip = stateStore.getTrip(this.props.tripKey)
        const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
        const amount = stateStore.amountToCurrency(event.currency, event.amount)
        this.setState({
            newEventName: event.name,
            newEventDescription: event.description,
            newEventCategory: event.category,
            newEventAmount: amount,
            newEventDate: event.date,
            currencies: trip.currencies,
            selectedCurrency: event.currency
        })
    }


    setEditEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    editEvent() {
        const event = { 
            key: this.props.eventKey,
            name: this.state.newEventName,
            description: this.state.newEventDescription,
            category: this.state.newEventCategory,
            amount: this.state.newEventAmount,
            currency: this.state.selectedCurrency,
            date: this.state.newEventDate,
         }
        if (event.name && event.description && event.category && event.amount && event.currency && !isNaN(event.amount)) {
            if (event.amount > 0) {
                stateStore.editEvent(this.state.tripKey, event)
                this.setEditEventDialog(false)
            }
            else {
                Alert.alert(
                    'Wrong amount',
                    'Amount must be positive!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }
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
    }
});