import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class EditSplitterDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            tripKey: this.props.tripKey,
            eventKey: this.props.eventKey,
            splitterKey: null,
            splitter: null,
            newSplitterName: null,
            newSplitterAmount: 0,
            newSplitterPaid: 0
        }
    }
    render() {
        return (

            <ModalWrapper
                onRequestClose={() => { this.setEditSplitterDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 24 }}
                visible={this.state.dialog}>
                <Text>Edit Splitter</Text>
                <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                        value={this.state.newSplitterName}
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                            this.setState({
                                newSplitterName: name
                            })
                        }}
                        autoFocus={true}
                        disabled />
                </Item>
                <Item floatingLabel>
                    <Label>Amount</Label>
                    <Input
                        value={this.state.newSplitterAmount.toString()}
                        selectionColor="#5067FF"
                        keyboardType='numeric'
                        onChangeText={(amount) => {
                            this.setState({
                                newSplitterAmount: amount
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <Item floatingLabel>
                    <Label>Paid</Label>
                    <Input
                        value={this.state.newSplitterPaid.toString()}
                        selectionColor="#5067FF"
                        keyboardType='numeric'
                        onChangeText={(paid) => {
                            this.setState({
                                newSplitterPaid: paid
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setEditSplitterDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.editSplitter()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
            </ModalWrapper>
        )
    }
    setInitState(){
        let splitter = this.state.splitter
        const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
        const amount = stateStore.amountToCurrency(event.currency, splitter.amount)
        const paid = stateStore.amountToCurrency(event.currency, splitter.paid)
        this.setState({
            newSplitterName: splitter.name,
            newSplitterAmount: amount,
            newSplitterPaid: paid
        })
    }
    setEditSplitterDialog(visible) {
        if(visible){
            this.setInitState()
        }
        this.setState({
            dialog: visible
        })
    }
    editSplitter() {
        const splitter ={ 
            key: this.state.splitterKey,
            name: this.state.newSplitterName,
            amount: this.state.newSplitterAmount,
            paid: this.state.newSplitterPaid
         } 
         const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
         const oldSplitter = event.splitters.get(splitter.key)
         const dividedAmountEvent = stateStore.getTotalAmountEvent(this.state.tripKey, this.state.eventKey)
         const normAmount = stateStore.amountToEuro(event.currency, splitter.amount)
         const normPaid = stateStore.amountToEuro(event.currency, splitter.paid)
        if (splitter.name && splitter.amount && splitter.paid) {
            if((parseFloat(normAmount) > parseFloat(event.amount)) || (parseFloat(normPaid) > parseFloat(event.amount))) {
                Alert.alert('Wrong amount',
                            'Amount/Paid may not exceed amount of event!',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed')}
                            ],
                            { cancelable: false}
                        )
            }
            else if (parseFloat(splitter.amount) < 0 || parseFloat(splitter.paid) < 0) {
                Alert.alert(
                    'Wrong amount',
                    'Amount/Paid must be positive!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }
            else if (normAmount > (event.amount - dividedAmountEvent + oldSplitter.amount)) {
                Alert.alert(
                    'Wrong amount',
                    `Amount may not be higher than ${stateStore.amountToCurrency(event.currency,(event.amount - dividedAmountEvent + oldSplitter.amount)).toFixed(2)}`,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            } else if(stateStore.getSplitter(this.state.tripKey, this.state.eventKey, this.state.existingSplitterKey)){
                Alert.alert(
                    'Error',
                    'This person is already a splitter of this event.',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }else{
                stateStore.editSplitter(this.state.tripKey, this.state.eventKey, splitter)
                this.setEditSplitterDialog(false)

            }

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