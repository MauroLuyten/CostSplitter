import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class AddSplitterDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            eventKey:this.props.eventKey,
            uid: this.props.uid,
            newSplitterName: '',
            newSplitterCurrency: '',
            newSplitterAmount: 0,
            newSplitterPaid: 'false'
        }
    }
    render() {
        return (

            <ModalWrapper
                onRequestClose={() => { this.setAddSplitterDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 24 }}
                visible={this.state.dialog}>
                <Text>Add Splitter</Text>
                <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                            this.setState({
                                newSplitterName: name
                            })
                        }}
                        autoFocus={true} />
                </Item>
                <Item floatingLabel>
                    <Label>Currency</Label>
                    <Input
                        selectionColor="#5067FF"
                        onChangeText={(currency) => {
                            this.setState({
                                newSplitterCurrency: currency
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <Item floatingLabel>
                    <Label>Amount</Label>
                    <Input
                        selectionColor="#5067FF"
                        onChangeText={(amount) => {
                            this.setState({
                                newSplitterAmount: amount
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setAddSplitterDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.addSplitter()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
            </ModalWrapper>
        )
    }
    setAddSplitterDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    addSplitter() {
        const { 
            eventKey, 
            uid, 
            newSplitterName, 
            newSplitterCurrency, 
            newSplitterAmount, 
            newSplitterPaid
         } = this.state;
        if (newSplitterName && newSplitterCurrency && newSplitterAmount) {
            if (newSplitterAmount > 0) {
                stateStore.addSplitterToEvent(
                    eventKey, 
                    newSplitterName, 
                    newSplitterCurrency, 
                    newSplitterAmount, 
                    newSplitterPaid)
                this.setAddSplitterDialog(false)
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