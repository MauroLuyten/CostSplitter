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
                        autoFocus={true} />
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
        const splitter = this.state.splitter
        this.setState({
            newSplitterName: splitter.name,
            newSplitterAmount: splitter.amount,
            newSplitterPaid: splitter.paid
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
        if (splitter.name && splitter.amount && splitter.paid) {
            if (splitter.amount > 0) {
                stateStore.editSplitter(this.state.tripKey, this.state.eventKey, splitter)
                this.setEditSplitterDialog(false)
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