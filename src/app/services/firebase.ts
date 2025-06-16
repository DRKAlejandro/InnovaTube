import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, where, updateDoc, deleteDoc, doc, serverTimestamp } from '@angular/fire/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  constructor(private firestore: Firestore) { }

  // Método para agregar un usuario
  async addUser(user: any) {
    try {
      const usersRef = collection(this.firestore, 'users');
      const docRef = await addDoc(usersRef, {
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: new Date()
      });
      console.log("Usuario registrado con ID: ", docRef.id);
      return docRef;
    } catch (error) {
      console.error("Error al agregar usuario: ", error);
      throw error;
    }
  }

  // Método para verificar si el email ya está registrado
  async isEmailTaken(email: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
  // Método para agregar un item generico
  addItem(item: any) {
    const itemsRef = collection(this.firestore, 'items');
    return addDoc(itemsRef, item);
  }

  // Método para obtener un usuario por email
  async getUserByEmail(email: string): Promise<any | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const user = querySnapshot.docs[0].data();
    return user;
  }

  // Método para actualizar la contraseña de un usuario por email
  async updatePasswordByEmail(email: string, newPassword: string): Promise<void> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { password: newPassword });
    }
  }

  // Método para agregar un video a favoritos
  async addFavorite(userEmail: string, video: any): Promise<void> {
    console.log('Intentando agregar favorito:', { userEmail, video });
    try {
      const favoritesRef = collection(this.firestore, 'favorites');
      const docRef = await addDoc(favoritesRef, {
        userEmail,
        videoId: video.id.videoId,
        videoData: video,
        createdAt: serverTimestamp() // Cambiado a serverTimestamp
      });
      console.log('Favorito agregado con ID:', docRef.id);
    } catch (error) {
      console.error("Error al agregar favorito: ", error);
      throw error;
    }
  }

  // Método para eliminar un video de favoritos
  async removeFavorite(userEmail: string, videoId: string): Promise<void> {
    try {
      const favoritesRef = collection(this.firestore, 'favorites');
      const q = query(
        favoritesRef,
        where('userEmail', '==', userEmail),
        where('videoId', '==', videoId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(this.firestore, 'favorites', document.id));
      });
    } catch (error) {
      console.error("Error al eliminar favorito: ", error);
      throw error;
    }
  }

  // Método para obtener todos los favoritos de un usuario
  async getFavorites(userEmail: string): Promise<any[]> {
    try {
      const favoritesRef = collection(this.firestore, 'favorites');
      const q = query(favoritesRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => doc.data()['videoData']);
    } catch (error) {
      console.error("Error al obtener favoritos: ", error);
      return [];
    }
  }

  // Método para verificar si un video es favorito
  async isFavorite(userEmail: string, videoId: string): Promise<boolean> {
    try {
      const favoritesRef = collection(this.firestore, 'favorites');
      const q = query(
        favoritesRef,
        where('userEmail', '==', userEmail),
        where('videoId', '==', videoId)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error al verificar favorito: ", error);
      return false;
    }
  }
}
