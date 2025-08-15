import React from 'react';
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';

const Categories: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 className="text-lg font-bold mb-4">Manage Categories</h2>
        {/* TODO: List, add, edit categories */}
        <IonButton expand="block" color="tertiary">Add Category</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Categories;
