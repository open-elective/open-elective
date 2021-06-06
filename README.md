# open-elective
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    
    
      match /allow-users/{allowed} {
      allow read: if isSignedIn() && isAllowedUser(); allow write: if isSignedIn() && isAllowedUser();
    }
    
    
     match /Misc/{Misc} {
      allow read: if isSignedIn(); allow write: if isSignedIn() && isAllowedUser();
    }
    
    
    match /studentData/{studentData} {
      allow read: if isSignedIn(); allow write: if isSignedIn() && isAllowedUser();
    }
    
     match /Schools/{Schools} {
      allow read: if isSignedIn(); allow write: if isSignedIn() && isAllowedUser();
    }
    
     match /courseData/{courseData} {
      allow read: if isSignedIn() && isAllowedUser(); allow write: if isSignedIn() && isAllowedUser();
    }
    
     match /studentprefs/{studentprefs} {
      allow read: if isSignedIn(); allow write: if isSignedIn();
    }
    
    
    }


    function isSignedIn() {
      return request.auth.uid != null;
    }
    function isAllowedUser() {
      return exists(/databases/$(database)/documents/allow-users/$(request.auth.token.email));
    }
  }
}