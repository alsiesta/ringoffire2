import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

import {
  addDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  private collRef: CollectionReference<DocumentData>;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.collRef = this.firestoreService.getCollection('games');
  }

   async newGame() {
    const docRef = await this.firestoreService.createDoc();
    console.log('Game info: ', docRef.id);

    this.router.navigateByUrl('/game/' + docRef.id);
  }

  // async newGame() {
  //   let game = new Game();
  //   const docRef = await addDoc(this.collRef, { game: game.toJSON() });
  //   console.log('Game info: ', docRef.id);

  //   this.router.navigateByUrl('/game/' + docRef.id);
  // }
}
