import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  addItem(item: any) {
    const itemsRef = collection(this.firestore, 'items');
    return addDoc(itemsRef, item);
  }

  getItems(): Observable<any[]> {
    const itemsRef = collection(this.firestore, 'items');
    return collectionData(itemsRef, { idField: 'id' }) as Observable<any[]>;
  }
}
