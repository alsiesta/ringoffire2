import { Injectable } from '@angular/core';

import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import {
  CollectionReference,
  DocumentData,
  collection,
} from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private collRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.collRef = collection(this.firestore, 'games');
  }
  
  getAll() {
    return collectionData(this.collRef, {
      idField: 'id',
    }) as Observable<Game[]>;
  }

  get(id: string) {
    const gamesDocumentReference = doc(this.firestore, `games/${id}`);
    return docData(gamesDocumentReference, { idField: 'id' });
  }

  create(game: Game) {
    return addDoc(this.collRef, game);
  }

  update(game: Game) {
    const gamesDocumentReference = doc(
      this.firestore,
      `games/${game['id']}`
    );
    return updateDoc(gamesDocumentReference, { ...game });
  }

  delete(id: string) {
    const gamesDocumentReference = doc(this.firestore, `games/${id}`);
    return deleteDoc(gamesDocumentReference);
  }
}
