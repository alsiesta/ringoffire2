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
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  game$: Observable<Game>;
  gameId: string;
  game: Game;
  firestore: Firestore = inject(Firestore);
  private collRef: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  public actualFirebasedata = [];

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.collRef = collection(this.firestore, 'games');
  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.updateGameProperties(params);
    });
  }

  updateGameProperties(params) {
    this.gameId = params['gameId'];
    this.docRef = doc(this.collRef, this.gameId);
    this.game$ = docData(this.docRef);
    this.game$.subscribe((response) => {
      const destructuredGameObject = response['game'];
      console.log(destructuredGameObject);
      this.game.currentPlayer = destructuredGameObject.currentPlayer;
      this.game.playedCards = destructuredGameObject.playedCards;
      this.game.players = destructuredGameObject.players;
      this.game.playerImages = destructuredGameObject.playerImages;
      this.game.stack = destructuredGameObject.stack;
      this.game.pickCardAnimation = destructuredGameObject.pickCardAnimation;
      this.game.currentCard = destructuredGameObject.currentCard;
    });
  }

  newGame() {
    this.game = new Game();
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
      console.log(this.game);
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      
      
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
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
        this.game.playerImages.push('avatar1.png');
        this.updateGame();
      }
    });
  }

  editPlayer(playerId) {

    console.log('edit player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      //muss prüfen, ob change auch zurückgegeben wird, sonst gibt es einen firebase error auf undefined
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId,1)
          this.game.playerImages.splice(playerId,1)
        }
        this.game.playerImages[playerId] = change;
      }
      this.updateGame();
    });
     
  }


  async updateGame() {
    await updateDoc(this.docRef, { game: this.game.toJSON() });
  }
}
