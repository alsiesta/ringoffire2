import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { delay, Observable } from 'rxjs';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  games$: Observable<any[]>;
  game: Game;
  firestore: Firestore = inject(Firestore);
  private collRef: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  public data = [];
  // newTodoText: string = 'Hallo';

  constructor(public dialog: MatDialog) {
    this.collRef = collection(this.firestore, 'games');
    this.games$ = collectionData(this.collRef);
    this.games$.subscribe((data) => {
      // *ngFor kann auf this.data zugreifen, weil Angular *ngFor kontinuierlich schaut, ob Daten da sind. Es versucht es nicht nur einmal und dann nicht mehr
      this.data = data;
      console.log('Observed data from INSIDE ngOnInit: ', this.data);
    });
  }

  ngOnInit() {
    this.logData();
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);

    // const coll = collection(this.firestore, "games");
    // setDoc(doc(coll), {name: this.newTodoText});
  }

  // auf games$ kann im template per "*ngFor="let data of games$ | asnc" zugegriffen werden
  //  ngOnInit() {
  //     this.games$ = collectionData(this.collRef);
  //     this.games$.subscribe();
  //     this.newGame();
  //   }

  // auf this.data kann nur mit Verzögerung zugegriffen werden. Denn console.log führt sofort aus und versucht es dann nicht wieder!!!


  logData() {
    setTimeout(() => {
      console.log('Observed data from OUTSIDE ngOnInit: ', this.data);
    }, 2000);
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        // prüfen, ob die Variable existiert und wenn ja, ob was drin steht. Nur dann wird der Name als Spieler in Players gepusht

        this.game.players.push(name);
      }
    });
  }
}
