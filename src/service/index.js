import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import Rx from 'rxjs/Rx';

import { FirebaseAppConfig } from '../conf/';

firebase.initializeApp(FirebaseAppConfig);

class UserService {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submit-user', {
    size: 'invisible',
    callback: response => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    }
  });

  phoneConfirmationResult = null;

  static getUserId() {
    if (firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    for (let item in localStorage) {
      if (Boolean(item.match(/firebase:authUser/))) {
        return JSON.parse(localStorage[item]).uid;
      }
    }
    return '';
  }

  loginFactory(method, data) {
    let loginPromise;
    if (method === 'mobile') {
      loginPromise = firebase.auth().signInWithPhoneNumber(data.phoneNumber, this.recaptchaVerifier);
      loginPromise.then(result => {
        this.phoneConfirmationResult = result;
      })
    }
    return loginPromise;
  }

  login(method, data) {
    let promise = new Promise((resolve, reject) => {
      this.loginFactory(method, data).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
    return promise;
  }

  verifyCode(code) {
    let promise = this.phoneConfirmationResult.confirm(code);
    promise.then(data => {
      console.log(data);
    });
    return promise;
  }

  logOut() {
    this.userId = null;
    return firebase.auth().signOut();
  }

}

class PrivateChatService {

  constructor(targetUserId) {
    this.userId = UserService.getUserId();
    this.targetUserId = targetUserId;
  }

  listenToMessage() {
    let conversationRef = firebase.database()
                                  .ref(`users/${this.userId}/conversations/${this.targetUserId}`)
                                  .orderByChild('timeStamp');
    let observable = Rx.Observable.create(observer => {
      conversationRef.on('child_added', (data) => {
        observer.next(data.val());
      });
    });
    return observable;
  }

  getListOfMessages() {
    let conversationRef = firebase.database()
                                  .ref(`users/${this.userId}/conversations/${this.targetUserId}`)
                                  .orderByChild('timeStamp');
    let observable = Rx.Observable.create(observer => {
      conversationRef.once('value').then((data) => {
        observer.next(data.val());
      });
    });
    return observable;
  }

  sendMessage(message) {
    let newMessageId = firebase.database().ref(`users/${this.userId}/conversations/${this.targetUserId}`).push().key;
    let newMessageRef = {};
    let data = {
      sender: this.userId,
      message: message,
      timeStamp: firebase.database.ServerValue.TIMESTAMP
    };
    newMessageRef[`/users/${this.userId}/conversations/${this.targetUserId}/${newMessageId}`] = data;
    newMessageRef[`/users/${this.targetUserId}/conversations/${this.userId}/${newMessageId}`] = data;
    return firebase.database().ref().update(newMessageRef);
  }

}

export {
  UserService,
  PrivateChatService
}
