import { Injectable } from '@angular/core';
import { Game } from 'src/models/game';

import {
  collection,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root', })
  
export class FirestoreService {
  game: Game;
  private gameCollection: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;

  constructor(private firestore: Firestore) {
    this.gameCollection = collection(this.firestore, 'games');
  }

  getCollection() {
    return this.gameCollection
  }

  getDocRef(gameId) {
    this.docRef = doc(this.gameCollection, gameId);
    return this.docRef;
  }

  getDocData() {
    const gameData = docData(this.docRef)
    return gameData;
  }

}
