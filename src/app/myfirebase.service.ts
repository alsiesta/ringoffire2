import { Injectable } from '@angular/core';
import { addDoc,collection,collectionData,CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, updateDoc, } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';

@Injectable({
  providedIn: 'root'
})
  
export class MyfirebaseService {
  private collRef: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  public actualFirebasedata = [];
  games$: Observable<any[]>;
  game: Game;
  constructor(private firestore: Firestore) {
    this.game = new Game();
    this.collRef = collection(this.firestore, 'games');
    this.collRef = collection(this.firestore, 'games');
    this.games$ = collectionData(this.collRef);
    this.games$.subscribe((firebasedata) => {
      // *ngFor kann auf this.games$ zugreifen, weil Angular *ngFor kontinuierlich schaut, ob neue Daten da sind. 
      this.actualFirebasedata = firebasedata;
    })
  }
  
  async getGameFromFirebase(gameId) {
    this.docRef = doc(this.collRef, gameId);
    const docSnap = await getDoc(this.docRef);
    //the game object on firebase is a nested object, which I have to destructure first
    const fireDocumentObject = docSnap.data();
    const destructuredGameObject = fireDocumentObject['game'];
    console.log('1. actual Game from firebase: ',destructuredGameObject);
    return destructuredGameObject;

    // //now I can access each key/value pair directly
    // this.game.currentPlayer = destructuredGameObject.currentPlayer;
    // this.game.playedCards = destructuredGameObject.playedCards;
    // this.game.players = destructuredGameObject.players;
    // this.game.stack = destructuredGameObject.stack;
    // console.log('Info from Game-Service: ',this.game);
  }
  
  async updateGameOnFirebase() {
    await updateDoc(this.docRef, { game: this.game.toJSON() });
    console.log(this.docRef);
  }
  // getAll() {
  //   return collectionData(this.collRef, {
  //     idField: 'id',
  //   }) as Observable<Game[]>;
  // }

  // get(id: string) {
  //   const gamesDocumentReference = doc(this.firestore, `games/${id}`);
  //   return docData(gamesDocumentReference, { idField: 'id' });
  // }

  // create(game: Game) {
  //   return addDoc(this.collRef, game);
  // }

  // update(game: Game) {
  //   const gamesDocumentReference = doc(
  //     this.firestore,
  //     `games/${game['id']}`
  //   );
  //   return updateDoc(gamesDocumentReference, { ...game });
  // }

  // delete(id: string) {
  //   const gamesDocumentReference = doc(this.firestore, `games/${id}`);
  //   return deleteDoc(gamesDocumentReference);
  // }
}
