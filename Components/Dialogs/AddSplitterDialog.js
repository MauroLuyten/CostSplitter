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
            tripKey: this.props.tripKey,
            eventKey:this.props.eventKey,
            newSplitterName: '',
            newSplitterAmount: 0,
            newSplitterPaid: 0
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
                    <Label>Amount</Label>
                    <Input
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
        const splitter ={ 
            name: this.state.newSplitterName,
            amount: this.state.newSplitterAmount,
            paid: this.state.newSplitterPaid
         } 
         const event = stateStore.getEvent(this.state.tripKey, this.state.eventKey)
        if (splitter.name && splitter.amount && splitter.paid) {
            if((parseInt(splitter.amount) > parseInt(event.amount)) && (parseInt(splitter.paid) > parseInt(event.amount))) {
                Alert.alert('Wrong amount',
                            'Amount/Paid may not exceed amount of event!',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed')}
                            ],
                            { cancelable: false}
                        )
            }
            else if (splitter.amount < 0 && splitter.paid < 0) {
                Alert.alert(
                    'Wrong amount',
                    'Amount/Paid must be positive!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }
            else {
                stateStore.addSplitter(this.state.tripKey, this.state.eventKey, splitter)
                this.setState({
                    newSplitterName: '',
                    newSplitterAmount: 0,
                    newSplitterPaid: 0
                })
                this.setAddSplitterDialog(false)
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