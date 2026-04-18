rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /loads/{document=**} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2026, 5, 15);
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
