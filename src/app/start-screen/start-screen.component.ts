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
     const docRef =  await this.firestoreService.createDoc();
      // Wenn docRef ein Promise ist (docRef: Promise<DocumentReference<DocumentData>>), weil ich es mit await aus dem Service bekomme, dann ist docRef eben keine DocumentReference (docRef: DocumentReference<DocumentData>) - sondern ein Promise - und ich kann nicht auf die docRef.id zugreifen!!!!!
    console.log('Game info: ', docRef.id);
    this.router.navigateByUrl('/game/' + docRef.id);
  }

  // alter Code ohne den Service
  // async newGame() {
  //   let game = new Game();
  //   const docRef = await addDoc(this.collRef, { game: game.toJSON() });
  //   console.log('Game info: ', docRef.id);

  //   this.router.navigateByUrl('/game/' + docRef.id);
  // }
}
