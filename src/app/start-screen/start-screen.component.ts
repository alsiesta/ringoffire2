import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

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
} from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  private collRef: CollectionReference<DocumentData>;

  constructor(private firestoreService: FirestoreService ,private router: Router, private firestore: Firestore) {
    this.collRef = this.firestoreService.getCollection();
  }

  async newGame() {
    let game = new Game();
    const docRef = await addDoc(this.collRef, { game: game.toJSON() });
    console.log('Game info: ', docRef.id);

    this.router.navigateByUrl('/game/'+ docRef.id);
  }
}
