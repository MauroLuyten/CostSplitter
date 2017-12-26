import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base'
import DatePicker from 'react-native-datepicker'
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class DivideEventDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            tripKey: this.props.tripKey,
            eventKey: this.props.eventKey,
            event: null,
            eventDivision: "",
            amountType: "Fixed Amount",
            amount: 0
        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => { this.setDivideEventDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <ScrollView>
                    <Text style={{ marginBottom: 16 }}>Divide Event</Text>

                    <Label>Division</Label>
                    <Picker onValueChange={(itemvalue, itemIndex) => this.setState({ eventDivision: itemvalue })} style={{ marginBottom: 16 }}
                        selectedValue={this.state.eventDivision}>
                        <Picker.Item label="Individually" value="Individually" />
                        <Picker.Item label="Equally" value="Equally" />

                    </Picker>
                    {this.state.eventDivision !== "Individually" &&
                        <View>
                            <Label>Type</Label>
                            <Picker onValueChange={(itemvalue, itemIndex) => this.setState({ amountType: itemvalue })} style={{ marginBottom: 16 }}
                                selectedValue={this.state.amountType}>
                                <Picker.Item label="Fixed Amount" value="Fixed Amount" />
                                <Picker.Item label="Custom Percentage" value="Custom Percentage" />
                                <Picker.Item label="Equal Share" value="Equal Share" />

                            </Picker>
                            {this.state.amountType !== "Equal Share" && 
                            <Item floatingLabel style={{ marginBottom: 16 }}>
                                <Label>Amount</Label>
                                <Input
                                    value={this.state.newEventAmount && this.state.newEventAmount.toString()}
                                    keyboardType='numeric'
                                    selectionColor="#5067FF"
                                    onChangeText={(amount) => {
                                        this.setState({
                                            amount: amount
                                        })
                                    }}
                                    autoFocus={false} />
                            </Item>
                            }
                        </View>
                    }
                    <View style={styles.buttonContainer}>
                        <Button transparent small onPress={() => this.setDivideEventDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.divideWarning()}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ScrollView>
            </ModalWrapper>
        )
    }
    componentWillMount() {
        const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
        const eventDivision = stateStore.getEventDivision(this.state.tripKey, this.state.eventKey)
        this.setState({
            event: event,
            eventDivision: eventDivision
        })
    }
    setDivideEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    divideWarning () {
        Alert.alert(
            'Waring',
            'Redividing the event will change/reset the amounts for each splitter on this event.',
            [
                { text: 'OK', onPress: () => this.divideEvent() },
            ],
            { cancelable: false }
        )
    }
    divideEvent() {
        const {tripKey, eventKey, event, eventDivision, amountType, amount} = this.state
        const splitterSize = stateStore.getSplitters(tripKey, eventKey).length
        if(splitterSize == 0){
            Alert.alert(
                'Error',
                'You require at least 1 splitter to divide the event.',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        } else{
            if(eventDivision=="Equally"){
                if(amount<0 && amountType!=="Equal Share"){
                    Alert.alert(
                        'Wrong amount',
                        'Amount must be positive!',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false }
                    )
                }
                else if(amountType=="Fixed Amount"){
                    console.log(splitterSize)
                    if((amount*splitterSize)>event.amount){
                        Alert.alert(
                            'Wrong amount',
                            `${amount} x ${splitterSize} splitters may not exceed Event amount.
                             Max amount is ${(event.amount / splitterSize).toFixed(2)}`,
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false }
                        )
                    } else {
                        stateStore.divideEvent(
                            tripKey, 
                            eventKey,
                            eventDivision,
                            amountType,
                            amount
                        )
                        this.setDivideEventDialog(false)
                    }
                }
                else if(amountType=="Custom Percentage"){
                    console.log(splitterSize)
                    if((amount*splitterSize)>100){
                        Alert.alert(
                            'Wrong amount',
                            `${amount}% x ${splitterSize} splitters may not exceed 100%.
                             Max amount is ${(100 / splitterSize).toFixed(2)}%`,
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false }
                        )
                    } else {
                        stateStore.divideEvent(
                            tripKey, 
                            eventKey,
                            eventDivision,
                            amountType,
                            amount
                        )
                        this.setDivideEventDialog(false)
                    }
                }
                else if(amountType=="Equal Share"){
                    stateStore.divideEvent(
                        tripKey, 
                        eventKey,
                        eventDivision,
                        amountType,
                        splitterSize
                    )
                    this.setDivideEventDialog(false)
                }
                 else {
                    stateStore.divideEvent(
                        tripKey, 
                        eventKey,
                        eventDivision,
                        amountType,
                        amount
                    )
                    this.setDivideEventDialog(false)
                }
            } else {
                stateStore.divideEvent(
                    tripKey, 
                    eventKey,
                    eventDivision,
                    amountType,
                    amount
                )
                this.setDivideEventDialog(false)
            }
        }
        
        
        /* const event = { 
            key: this.props.eventKey,
            name: this.state.newEventName,
            description: this.state.newEventDescription,
            Division: this.state.newEventCategory,
            amount: this.state.newEventAmount,
            currency: this.state.newEventCurrency,
            date: this.state.newEventDate
         }
        if (event.name && event.description && event.Division && event.amount) {
            if (event.amount > 0) {
                stateStore.divideEvent(this.state.tripKey, event)
                this.setDivideEventDialog(false)
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
        } */
    }
}
const styles = StyleSheet.create({

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});