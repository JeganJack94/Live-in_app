import React from 'react';
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';

const Transactions: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Transactions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 className="text-lg font-bold mb-4">Add or View Transactions</h2>
        {/* TODO: Transaction list, add/edit form, quick-add FAB */}
        <IonButton expand="block" color="secondary">Add Transaction</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Transactions;
