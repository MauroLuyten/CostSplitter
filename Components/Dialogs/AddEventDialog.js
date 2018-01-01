import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView} from 'react-native'
import { Text, Label, Item, Input, Button, Picker} from 'native-base';
import DatePicker from 'react-native-datepicker'
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class AddEventDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.tripKey,
            dialog: false,
            uid: this.props.uid,
            newEventName: '',
            newEventDescription: '',
            newEventCategory: 'Overnight stay',
            newEventAmount: 0,
            newEventDate: '01-01-2018',
            currencies: [],
            selectedCurrency: ''
        }
    }
    render() {
        return (

            <ModalWrapper
                onRequestClose={() => { this.setAddEventDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <ScrollView>
                <Text style={{ marginBottom: 16 }}>Add Event</Text>
                <Item floatingLabel style={{ marginBottom: 16 }}>
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
                <Item floatingLabel style={{ marginBottom: 16 }}>
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
                <Picker selectedValue={this.state.selectedCurrency} onValueChange={(itemvalue, itemIndex) => this.setState({selectedCurrency: itemvalue})}>
                    {this.state.currencies.map(currency => (
                        <Picker.Item key={currency.label} label={currency.label} value={currency.value} />
                    ))}
                </Picker>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Amount</Label>
                    <Input
                        value={this.state.newEventAmount.toString()}
                        keyboardType='numeric'
                        selectionColor="#5067FF"
                        onChangeText={(amount) => {
                            this.setState({
                                newEventAmount: amount
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
                    <Button transparent small onPress={() => this.setAddEventDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.addEvent()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
                </ScrollView>
            </ModalWrapper>
        )
    }
    componentWillMount() {
        const trip = stateStore.getTrip(this.props.tripKey)
        this.setState({
            currencies: trip.currencies,
            selectedCurrency: trip.currencies[0].value
        })
    }
    setAddEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    addEvent() {
        const event = {
            name: this.state.newEventName,
            description: this.state.newEventDescription,
            category: this.state.newEventCategory,
            amount: this.state.newEventAmount,
            currency: this.state.selectedCurrency,
            date: this.state.newEventDate
        }
        if (event.name && event.description && event.category && event.amount && event.currency) {
            if (event.amount
                > 0) {
                stateStore.addEvent(this.state.tripKey, event)
                this.setAddEventDialog(false)
                this.setState({
                    newEventName: '',
                    newEventDescription: '',
                    newEventCategory: 'Overnight stay',
                    newEventAmount: 0,
                    selectedCurrency: '',
                    newEventDate: '01-01-2018'
                })
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