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
 
      this.actualFirebasedata = firebasedata;
    });
  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      console.log(params['gameId']);
      this.gameId = params['gameId'];
       this.docRef = doc(this.collRef, params['gameId']);
      const docSnap = await getDoc(this.docRef);

      const fireDocumentObject = docSnap.data();
      const destructuredGameObject = fireDocumentObject['game'];

      this.game.currentPlayer = destructuredGameObject.currentPlayer;
      this.game.playedCards = destructuredGameObject.playedCards;
      this.game.players = destructuredGameObject.players;
      this.game.stack = destructuredGameObject.stack;
      this.game.pickCardAnimation = destructuredGameObject.pickCardAnimation;
      this.game.currentCard = destructuredGameObject.currentCard;      
    });
    
  }

   newGame() {
    this.game = new Game();
  }

  async createGame() {
    let gameInfo = await addDoc(this.collRef,{ game: this.game.toJSON() });
    console.log('Game info: ', gameInfo.id);
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }
  
  async updateGame() {
    await updateDoc(this.docRef, { game: this.game.toJSON() });    
  }
  
}
