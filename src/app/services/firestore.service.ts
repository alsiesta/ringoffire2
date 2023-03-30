import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, onSnapshot, updateDoc, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private collRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) { }

  getCollectionRef(collectionName) {
    return collection(this.firestore, collectionName);
  }

  getDocRef(params) {
    let gameId = params['gameId'];
    return doc(this.collRef, gameId);
  }
}
