import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { delay, Observable } from 'rxjs';
import { collection, collectionData, CollectionReference, DocumentData, DocumentReference, Firestore } from '@angular/fire/firestore';

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

  constructor(public dialog: MatDialog) {
    this.collRef = collection(this.firestore, 'games'); 
  }

 ngOnInit() {
    this.games$ = collectionData(this.collRef);
    this.games$.subscribe(data => {
      this.data = data;
      console.log('Observed data from INSIDE ngOnInit: ',this.data);
    });

    this.newGame();
    this. logToConsole()
  }

  logToConsole() {
    console.log('My Collection: ', this.collRef);
    console.log('My Observable: ',this.games$);
    console.log('Observed data from OUTSIDE ngOnInit: ', this.data);
  }

  
  newGame() {
    this.game = new Game();
    console.log(this.game);
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
