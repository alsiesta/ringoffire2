import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { delay, Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  games$: Observable<any[]>;
  gameId: string;
  game: Game;
  firestore: Firestore = inject(Firestore);
  private collRef: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  public actualFirebasedata = [];

  constructor(public dialog: MatDialog, private route:ActivatedRoute) {
    this.collRef = collection(this.firestore, 'games');
    this.games$ = collectionData(this.collRef);
    this.games$.subscribe((firebasedata) => {
      // *ngFor kann auf this.games$ zugreifen, weil Angular *ngFor kontinuierlich schaut, ob neue Daten da sind. 
      this.actualFirebasedata = firebasedata;
    });
  }

  ngOnInit() {
    // this.logData();  // is logging data with delay to demonstrate runntime behavior of observable data
    this.newGame();
    this.route.params.subscribe(async (params) => {
      console.log(params['gameId']);
      this.gameId = params['gameId'];
       this.docRef = doc(this.collRef, params['gameId']);
      const docSnap = await getDoc(this.docRef);
      //the game object on firebase is a nested object, which I have to destructure first
      const fireDocumentObject = docSnap.data();
      const destructuredGameObject = fireDocumentObject['game'];
      //now I can access each key/value pair directly
      this.game.currentPlayer = destructuredGameObject.currentPlayer;
      this.game.playedCards = destructuredGameObject.playedCards;
      this.game.players = destructuredGameObject.players;
      this.game.stack = destructuredGameObject.stack;
      
      console.log('actual Game from firebase: ',destructuredGameObject);
      console.log('actual Game at runtime in browser: ',this.game);
      // setDoc(doc(this.collRef), {game: this.game.toJSON()});
    });
    
  }

   newGame() {
    this.game = new Game();
    //  this.createGame();
  }

  async createGame() {
    let gameInfo = await addDoc(this.collRef,{ game: this.game.toJSON() });
    console.log('Game info: ', gameInfo.id);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.updateGame();

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        // prüfen, ob die Variable existiert und wenn ja, ob was drin steht. Nur dann wird der Name als Spieler in Players gepusht

        this.game.players.push(name);
        this.updateGame();
      }
    });
  }
  
  async updateGame() {
    await updateDoc(this.docRef, { game: this.game.toJSON() });
    console.log(this.docRef);
    
  }
  
  //############ MEMORIZE ###################
  // auf games$ kann im template per "*ngFor="let data of games$ | asnc" zugegriffen werden
  //  ngOnInit() {
  //     this.games$ = collectionData(this.collRef);
  //     this.games$.subscribe();
  //     this.newGame();
  //   }

  // auf this.data kann nur mit Verzögerung zugegriffen werden. Denn console.log führt sofort aus und versucht es dann nicht wieder!!!
  // logData() {
  //   setTimeout(() => {
  //     console.log('Observed data from OUTSIDE ngOnInit: ', this.data);
  //   }, 2000);
  // }
  //############ MEMORIZE ###################
  
 
 
}
