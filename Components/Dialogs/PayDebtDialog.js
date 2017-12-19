import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class RemoveSplitterDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            tripKey: this.props.tripKey,
            eventKey: this.props.eventKey,
            splitterKey: null,
            splitter: null,
            removeAmount: 0
        }
    }
    render() {
        const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
        return (
            <ModalWrapper
            onRequestClose={() => { this.setPayDebtDialog(false) }}
            style={{ width: 350, height: 'auto', padding: 16 }}
            visible={this.state.dialog}>
            <Text style={{ marginBottom: 16 }}>Pay debt: {event.name}</Text>
            <Text> Amount to pay: {this.state.splitter.amount}</Text>
            <Item floatingLabel>
                    <Label>Amount</Label>
                    <Input
                        selectionColor="#5067FF"
                        onChangeText={(amount) => {
                            this.setState({
                                removeAmount: amount
                            })
                        }}
                        autoFocus={false} />
                </Item>
            <View style={styles.buttonContainer}>
                <Button transparent small onPress={() => this.setPayDebtDialog(false)}>
                    <Text style={{ color: '#5067FF' }}>Cancel</Text>
                </Button>
                <Button primary small onPress={() => this.paydebt()}>
                    <Text style={{ color: 'white' }}>Confirm</Text>
                </Button>
            </View>
        </ModalWrapper>
        )
    }
    componentWillMount() {
        const splitter = stateStore.getEvent(this.state.tripKey, this.state.eventKey, this.state.splitterKey)
        this.setState({
            splitter: splitter
        })
    }

    setPayDebtDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    paydebt() {
        if(this.state.removeAmount > stateStore.getSplitter(this.state.tripKey, this.state.eventKey, this.state.splitterKey).amount) {
            Alert.alert('Wrong amount',
                        'Amount to pay may not exceed amount of splitter to pay')
        }
        else if(this.state.removeAmount < 0) {
            Alert.alert(
                'Wrong amount',
                'Amount to pay must be positive!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        }
        else {
            stateStore.payDebtSplitter(this.state.tripKey, this.state.eventKey, this.state.splitterKey, this.state.removeAmount)
            this.setPayDebtDialog(false)
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