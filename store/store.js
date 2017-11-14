import { observable, action, computed } from 'mobx'
import { firebaseApp } from '../firebaseconfig'
import { ListView } from "react-native";

class StateStore {
    @observable user = {}
    @observable events = []
    @observable error = {}

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
                    events: 0
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
                this.events = []
            })
            .catch(error => {
                this.error = error
            })
    }
    setUser(user) {
        this.user = user
        if(user){
            this.loadEvents()
        }
    }
    loadEvents() {
        if (this.user) {
            firebaseApp
            .database()
            .ref(`users/${this.user.uid}/events`).on('value', (snap) => {
                this.events = []
                snap.forEach((item) => {
                    let event = item.val()
                    event.key = item.key
                    this.events.push(event)
                })
            })
        }
    }
    addEvent(event){
        firebaseApp.database().ref(`users/${this.user.uid}/events`).push(event)
        .then()
        .catch(error => {
            this.error=error
        })
    }
    removeEvent(key){
        firebaseApp
        .database()
        .ref(`users/${this.user.uid}/events`).child(key).remove()
        .catch(error=>{
            this.error=error
        })
    }
    getEvent(eventKey) {
        return this.events.find(event => event.key === eventKey)
    }
    addSplitterToEvent(eventKey, name, currency, amount, paid) {
        //console.warn(name)
        //console.warn(currency)
        //console.warn(amount)
        //console.warn(paid)
        firebaseApp.database().ref(`users/${this.user.uid}/events/${eventKey}/splitters`).push({
            name: name,
            currency: currency,
            amount: amount,
            paid: paid
        })
        .then()
        .catch(error => {
            this.error=error
        })
    }

}
const stateStore = new StateStore()
export default stateStore;