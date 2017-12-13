import { observable, action, computed } from 'mobx'
import { firebaseApp } from '../firebaseconfig'
import { ListView } from "react-native";
import {AsyncStorage} from 'react-native'
import {create, persist} from 'mobx-persist'


class Splitter {
    constructor(name,amount){
        this.name = name
        this.amount = amount
    }
    @persist @observable  name = ''
    @persist @observable amount = 0
}
class Event {
    constructor(name, description, category, amount, currency, date){
        this.name = name
        this.description = description
        this.currency = currency
        this.amount = amount
        this.category = category
        this.date = date
    }
    @persist @observable  name = ''
    @persist @observable description = ''
    @persist @observable category = ''
    @persist @observable amount = 0
    @persist @observable date = ''
    @persist @observable currency = 'euro'
    @persist('map', Splitter) @observable splitters = new Map()
}
class Trip {
    constructor(name,description, budget){
        this.name = name
        this.description = description
        this.budget = budget
    }
    @persist @observable  name = ''
    @persist @observable description = ''
    @persist @observable budget = ''
    @persist('map', Event) @observable events = new Map()
}
class StateStore {
    @persist('object') @observable user = {}
    @persist('map', Trip) @observable trips = new Map()
    @persist('object') @observable error = {}
    @observable online = false



    /* writeToStorage() {
        AsyncStorage.setItem('trips', JSON.stringify(this.trips))
        .then()
        .catch(error=>{
            
        })
    } */
    generateKey() {
        return firebaseApp.database().ref().push().key
    }
    @action addTrip(trip) {
        
        let key = this.generateKey()
        this.trips.set(key, new Trip(trip.name, trip.description, trip.budget))
        if (this.online) {
            firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(key).set(trip)
                .then()
                
        }
    }
    getTrip(tripKey) {
        return this.trips.get(tripKey)
    }
    @computed get getTrips(){
        let tripsArray = []
        this.trips.keys().forEach(key => {
            let trip = this.trips.get(key)
            trip.key = key
            tripsArray.push(trip)
        });
        //console.warn(JSON.stringify(tripsArray))
        return tripsArray
    }
    editTrip(tripKey, trip) {
        //TODO
        const oldTrip = this.getTrip(tripKey)
        oldTrip.name = trip.name
        oldTrip.description = trip.description
        this.trips.set(tripKey, oldTrip)
    }
    removeTrip(tripKey) {
        this.trips.delete(tripKey)
        if (this.online) {
            firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(tripKey).remove()
        }
    }
    addEvent(tripKey, event) {
        event.splitters = observable.map()
        const key = this.generateKey()
        this.trips.get(tripKey).events.set(key,new Event(event.name, event.description, event.category, event.amount, event.currency, event.date))
        if (this.online) {
            database().ref(`users/${this.user.uid}/trips`)
                .child(tripKey)
                .child('events')
                .child(newEvent.key)
                .set(event)
        }
    }
    getEvent(tripKey,eventKey){
        return this.trips.get(tripKey).events.get(eventKey)
    }
    getEvents(tripKey) {
        let eventsArray = []
        this.trips.get(tripKey).events.keys().forEach(key => {
            let event = this.trips.get(tripKey).events.get(key)
            event.key = key
            eventsArray.push(event)
        });
        return eventsArray
    }
    editEvent(tripKey, event){
        //TODO
        const eventKey = event.key
        const oldEvent = this.getEvent(tripKey,eventKey)
        oldEvent.name = event.name
        oldEvent.description = event.description
        oldEvent.category = event.category
        oldEvent.amount = event.amount
        oldEvent.currency = event.currency
        oldEvent.date = event.date
        this.trips.get(tripKey).events.set(eventKey, oldEvent)
    }
    removeEvent(tripKey, eventKey){
        this.trips.get(tripKey).events.delete(eventKey)
        if(this.online){
            firebaseApp.database().ref(`users/${this.user.uid}/trips`)
            .child(tripKey)
            .child('events')
            .child(eventKey)
            .remove()
        }
    }
    addSplitter(tripKey, eventKey, splitter){
        const key = this.generateKey()
        this.trips.get(tripKey).events.get(eventKey).splitters.set(
            key,new Splitter(splitter.name, splitter.amount))
        if(this.online){
            firebaseApp.database().ref(`users/${this.user.uid}/trips`)
            .child(tripKey)
            .child('events')
            .child(eventKey)
            .child('splitters')
            .child(key)
            .set(splitter)
        }
    }
    getSplitter(tripKey, eventKey, splitterKey){
        return this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
    }
    getSplitters(tripKey, eventKey){
        let splittersArray = []
        this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(key => {
            let splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(key)
            splitter.key = key
            splittersArray.push(splitter)
        });
        return splittersArray
    }
    editSplitter(tripKey, eventKey, splitter){
        //TODO
        const splitterKey = splitter.key
        this.trips.get(tripKey).events.get(eventKey).splitters.set(splitterKey, new Splitter(splitter.name, splitter.amount))
        //console.warn(JSON.stringify(this.getSplitters(tripKey,eventKey)))
    }
    removeSplitter(tripKey, eventKey, splitterKey){
        this.trips.get(tripKey).events.get(eventKey).splitters.delete(splitterKey)
    }
    login(username, password) {
        firebaseApp.auth().signInWithEmailAndPassword(`${username}@costsplitter.com`, password)
            .then(user => {
                this.setUser(user)
            }).catch(error => {
                this.error = error
            })
    }
    register(username, password) {
        firebaseApp.auth().createUserWithEmailAndPassword(`${username}@costsplitter.com`, password)
            .then((data) => {
                firebaseApp.database().ref(`users/${data.uid}`).set({
                    email: `${username}@costsplitter.com`,
                    username: username,
                    trips: 0
                })
            }).catch((error) => {
                this.error = error
            })
    }
    logout() {
        firebaseApp
            .auth()
            .signOut().then(() => {
                this.setUser({})
                this.trips = []
            })
            .catch(error => {
                this.error = error
            })
    }
    setUser(user) {
        this.user = user
        if(user){
            //this.loadTrips()
        }
    }
    /*
    loadTrips() {
        if (this.user) {
            firebaseApp
            .database()
            .ref(`users/${this.user.uid}/trips`).on('value', (snap) => {
                this.trips = []
                snap.forEach((item) => {
                    let trip = item.val()
                    trip.key = item.key
                    this.trips.push(trip)
                })
            })
        }
    }
    addTrip(trip){
        firebaseApp.database().ref(`users/${this.user.uid}/trips`).push(trip)
        .then()
        .catch(error => {
            this.error=error
        })
    }
    removeTrip(key){
        firebaseApp
        .database()
        .ref(`users/${this.user.uid}/trips`).child(key).remove()
        .catch(error=>{
            this.error=error
        })
    }
    editTrip(trip, key){
        firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(key).update(trip)
        .then()
        .catch(error=> {
            this.error=error
        })
    }
    getTrip(tripKey) {
        return this.trips.find(trip => trip.key === tripKey)
    }
    addSplitterToEvent(eventKey, name, currency, amount, paid) {
        //console.warn(name)
        //console.warn(currency)
        //console.warn(amount)
        //console.warn(paid)
        firebaseApp.database().ref(`users/${this.user.uid}/trips/${tripKey}/events`).push({
            name: name,
            currency: currency,
            amount: amount,
            paid: paid
        })
        .then()
        .catch(error => {
            this.error=error
        })
    } */

}
const stateStore = new StateStore()
    const hydrate = create({
        storage: AsyncStorage,
        jsonify: true
    })
    hydrate('state', stateStore)
export default stateStore;