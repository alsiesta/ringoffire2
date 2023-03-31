import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DocumentReference,updateDoc,} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { FirestoreService } from '../services/firestore.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  game$: Observable<Game>;
  gameId: string;
  game: Game;
  
  private docRef: DocumentReference<any>;
  public actualFirebasedata = [];
  gameOver = false;

  constructor(private firestoreService: FirestoreService ,private router: Router, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.updateGameProperties(params);
    });
  }

  updateGameProperties(params) {
    this.gameId = params['gameId'];
    this.docRef = this.firestoreService.getDocRef(this.gameId);
    this.game$ = this.firestoreService.getDocData();
    
    this.game$.subscribe((response) => {
      this.game.currentPlayer = response.currentPlayer;
      this.game.playedCards = response.playedCards;
      this.game.players = response.players;
      this.game.playerImages = response.playerImages;
      this.game.stack = response.stack;
      this.game.pickCardAnimation = response.pickCardAnimation;
      this.game.currentCard = response.currentCard;
    });
    // this.game$.subscribe((response) => {
    //   const destructuredGameObject = response['game'];
    //   this.game.currentPlayer = destructuredGameObject.currentPlayer;
    //   this.game.playedCards = destructuredGameObject.playedCards;
    //   this.game.players = destructuredGameObject.players;
    //   this.game.playerImages = destructuredGameObject.playerImages;
    //   this.game.stack = destructuredGameObject.stack;
    //   this.game.pickCardAnimation = destructuredGameObject.pickCardAnimation;
    //   this.game.currentCard = destructuredGameObject.currentCard;
    // });
  }

  newGame() {
    this.game = new Game();
  }

  restartGame() {
    this.router.navigateByUrl('');
  }

  takeCard() {
    if (this.game.stack.length === 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      console.log(this.game);
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      // this.firestoreService.updateDoc();
      
      this.updateGame();
      console.log(this.game);
      

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        // this.firestoreService.updateDoc();

        this.updateGame();
      }, 1000);
    }
  }

  editPlayer(playerId: number) {
    console.log('Edit player: ', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received change', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.playerImages.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        // this.firestoreService.updateDoc();

        this.updateGame();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('avatar0.png');
        // this.firestoreService.updateDoc();

        this.updateGame();
      }
    });
  }

  updateGame() {
     updateDoc(this.docRef, this.game.toJSON() );
  }
  // async updateGame() {
  //   await updateDoc(this.docRef, { game: this.game.toJSON() });
  // }
}
