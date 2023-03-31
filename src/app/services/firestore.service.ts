import { Injectable } from '@angular/core';
import { Game } from 'src/models/game';

import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  game: Game;
  private gameCollection: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;

  constructor(private firestore: Firestore) {
    this.gameCollection = collection(this.firestore, 'games');
  }

  getCollection(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  getDocRef(gameId) {
    this.docRef = doc(this.gameCollection, gameId);
    return this.docRef;
  }

  getDocData() {
    const gameData = docData(this.docRef);
    return gameData;
  }

   createDoc() {
    let game = new Game();
     return addDoc(this.gameCollection, game.toJSON());
     
    // unten setze ich innerhalb der {} das game nochmals in ein game{}. Und deswegen muss ich das in game.ts deconstructen
    // let game = new Game();
    // return addDoc(this.gameCollection, { game: game.toJSON() });
  }
}
