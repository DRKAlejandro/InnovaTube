import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      "projectId":"innovatube-405f0",
      "appId":"1:66045938353:web:958c9233a4eb384f20f090",
      "storageBucket":"innovatube-405f0.firebasestorage.app",
      "apiKey":"AIzaSyAZVZlnl3Dn6GSb0PvW_DMwPsELX8_SAkA",
      "authDomain":"innovatube-405f0.firebaseapp.com",
      "messagingSenderId":"66045938353",
      "measurementId":"G-L2D0RVFMGX"
    })),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()) 
  ]
};