import React, { Component } from 'react'
import { StyleSheet, View, Alert, Picker, ScrollView } from 'react-native'
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
            existingSplitterKey: '',
            newSplitterName: '',
            newSplitterAmount: 0,
            newSplitterPaid: 0
        }
    }
    render() {
        const persons = stateStore.getPersons()
        let pickeritems = []
        pickeritems.push(<Picker.Item key="new" label="New splitter" value="new" />)
        persons.forEach(person => {
            pickeritems.push(<Picker.Item label={person.name} key={person.key} value={person.key} />)
        })
        return (
            <ModalWrapper
                onRequestClose={() => { this.setAddSplitterDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 24 }}
                visible={this.state.dialog}>
                <ScrollView>
                <Text>Add Splitter</Text>
                <Label>Existing</Label>
                <Picker
                    onValueChange={( itemValue, itemIndex) => {
                        if(itemIndex!==0){
                            this.setState({
                                newSplitterName: persons[itemIndex-1].name,
                                existingSplitterKey: persons[itemIndex-1].key
                            })
                        } else if(itemValue=="new"){
                            this.setState({
                                newSplitterName: '',
                                existingSplitterKey: ''
                            })
                        }
                    }}
                    selectedValue= {this.state.newSplitterName=='' ? "new" : this.state.existingSplitterKey}
                    style={{ marginBottom: 16 }}>
                   {pickeritems}
                </Picker>
                <Label>New</Label>
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
                        disabled={this.state.existingSplitterKey!==''} />
                </Item>
                <Item floatingLabel>
                    <Label>Amount</Label>
                    <Input
                        value={this.state.newSplitterAmount.toString()}
                        selectionColor="#5067FF"
                        keyboardType='numeric'
                        onChangeText={(amount) => {
                            this.setState({
                                newSplitterAmount: amount.replace(",", ".")
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
                                newSplitterPaid: paid.replace(",", ".")
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
                </ScrollView>
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
         const dividedAmountEvent = stateStore.getTotalAmountEvent(this.state.tripKey, this.state.eventKey)
         const normAmount = stateStore.amountToEuro(event.currency, splitter.amount)
         const normPaid = stateStore.amountToEuro(event.currency, splitter.paid)
        if (splitter.name && splitter.amount && splitter.paid && !isNaN(splitter.amount) && !isNaN(splitter.paid)) {
            if((parseFloat(normAmount) > parseFloat(event.amount)) || (parseFloat(normPaid) > parseFloat(event.amount))) {
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
            else if (normAmount > event.amount - dividedAmountEvent) {
                Alert.alert(
                    'Wrong amount',
                    `Amount may not be higher than ${stateStore.amountToCurrency(event.currency,(event.amount - dividedAmountEvent)).toFixed(2)}`,
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
            }
            else {
                stateStore.addSplitter(this.state.tripKey, this.state.eventKey, splitter, this.state.existingSplitterKey)
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