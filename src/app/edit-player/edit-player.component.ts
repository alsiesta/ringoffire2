import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  allProfilePictures = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>){} 

}
