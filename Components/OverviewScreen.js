import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddTripDialog from './Dialogs/AddTripDialog'
import RemoveTripDialog from './Dialogs/RemoveTripDialog'

@observer
export default class OverviewScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedEvent: '',
            RemoveTripDialog: false,
        }

    }
    static navigationOptions = {
        title: 'Overview'
    }
    render() {
        const trips = stateStore.getTrips()
        return (
            <View style={styles.container}>
                <Separator bordered style={styles.seperator}>
                    <Text style={{fontWeight: 'bold'}}>TRIPS</Text>
                </Separator>
                {!trips.length ?
                    (
                        <Text style={{marginLeft:16, marginTop: 16}}>
                            No trips added yet
                        </Text>
                    )
                    :
                    (<List
                        style={styles.list}
                        dataArray={_.cloneDeep(trips)}
                        renderRow={(trip) =>
                            <ListItem button style={styles.listitem} onPress={() => { this.openTrip(trip.key) }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{trip.name}</Text>
                                    <View>
                                        <Badge
                                            style={{ marginRight: 5, backgroundColor: '#5067FF' }}>
                                            <Text onPress={() => { { this.setRemoveTripDialog(trip.key) } }}>
                                                X
                                            </Text>
                                        </Badge>
                                    </View>
                                </View>
                            </ListItem>
                        }>
                        ></List>
                    )}
                <AddTripDialog ref="AddTripDialog" uid={this.state.uid}>

                </AddTripDialog>

                <RemoveTripDialog
                    ref="RemoveTripDialog"
                    uid={this.state.uid}>
                </RemoveTripDialog>

                <Fab
                    active={true}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddTripDialog(true)}
                >
                    <Text>+</Text>
                </Fab>


            </View>
        )
    }
    openTrip(key) {
        this.navigate('Trip', {
            tripKey: key,
            //OnNavigateBack: this.handleOnNavigateBack
        })
    }
    /* handleOnNavigateBack = () => {
        this.setState(this.state)
    } */
    navigate(route, params) {
        const { navigate } = this.props.navigation
        navigate(route, params)
    }
    setAddTripDialog(visible) {
        this.refs.AddTripDialog.setAddTripDialog(visible)
    }
    setRemoveTripDialog(key) {
        const trip = stateStore.getTrip(key)
        this.refs.RemoveTripDialog.setState({
            trip: trip
        })
        this.refs.RemoveTripDialog.setRemoveTripDialog(true)
    }
}
const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flex: 1
    },
    seperator: {
        maxHeight: 35
    },
    list: {
        alignSelf: 'stretch'
    },
    listitem: {
        margin: 0,
        marginLeft: 0,
        paddingLeft: 17,
        alignSelf: 'stretch'
    },
    modal: {
        height: 300,
        alignSelf: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    button: {
        margin: 5
    }
});