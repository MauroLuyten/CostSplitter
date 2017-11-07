import React, { Component } from 'react'
import {StyleSheet, View} from 'react-native'
import {Badge, ListView, List, ListItem, Content, Container, Text, Separator} from 'native-base';
import {firebaseApp} from '../firebaseconfig'
import stateStore from '../store/store'
import {observer} from 'mobx-react'

@observer
export default class EventScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            eventKey: null,
            uid: null,
            eventRef: null
        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render(){
        const event = stateStore.getEvent(this.state.eventKey)

        return(
            <Content>
                <View>
                    <Text style={{fontSize:22, fontWeight:'bold', marginBottom:5}}>{event.name}</Text>
                    <View style={styles.viewBorder}>
                        <Text style={styles.textmargin}>Description:             {event.description  == null ? "/" : event.description}</Text>
                        <Text style={styles.textmargin}>Amount:                   {event.amount == null ? "/": event.amount} {event.currency === null ? "/" : event.currency}</Text>
                        <Text style={styles.textmargin}>Date:                         {event.date == null ? "/" : event.date}</Text>
                    </View>
                    <Text style={{marginTop:40, fontWeight: 'bold'}}>Splitters:                                                  paid</Text>
                    {event.splitters == null ? (
                        <Text>No splitters</Text>
                    ) 
                    :
                    (<List style={styles.list} dataArray={event.splitters}
                    renderRow={(splitter) => 
                        <ListItem style={styles.listitem}>
                            <View  style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>{splitter.name}   {splitter.amount} {splitter.currency}</Text>
                                <Badge style={{marginRight: 50, backgroundColor:"#009688"}}>
                                       <Text>{splitter.paid === "true" ? 'V' : 'X'}</Text>
                                </Badge>
                            </View>
                        </ListItem>
                    }>></List>
                )}
                </View>
            </Content>
        )
    }
    componentWillMount() {
        const uid = this.props.navigation.state.params.uid
        const eventKey = this.props.navigation.state.params.key
        this.setState({
            uid: uid,
            eventRef: firebaseApp.database().ref(`users/${uid}/events/${eventKey}`),
            eventKey: eventKey
        })    
    }
}


const styles = StyleSheet.create({
    seperator: {
        maxHeight: 35
    },
    list: {
        alignSelf: 'stretch'
    },
    listitem: {
        marginTop: 20,
        margin: 0,
        marginLeft: 0,
        paddingLeft: 17,
        alignSelf: 'stretch',
        backgroundColor: '#F4F4F4'
    },
    textmargin: {
        marginTop: 17,
    },
    viewBorder: {
        borderRadius: 4,
        borderWidth: 0.2,
        borderColor: '#d6d7da',
    }
});