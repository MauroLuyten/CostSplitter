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
            splitterKey: this.props.splitterKey,
            newSplitterName: '',
            newSplitterAmount: 0,
            newSplitterPaid: 'false'
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
                        onChangeText={(amount) => {
                            this.setState({
                                newSplitterAmount: amount
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
    setEditSplitterDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    editSplitter() {
        const splitter ={ 
            key: this.state.splitterKey,
            name: this.state.newSplitterName,
            amount: this.state.newSplitterAmount
         } 
        if (splitter.name && splitter.amount) {
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