import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [CommonModule,
            RouterModule,
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule,
            AngularFireAuthModule,
  ],
  exports: []
})
export class SharedModule {}

