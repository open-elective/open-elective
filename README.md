# open-elective
Button JS
var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },6000);
};

var classname = document.getElementsByClassName("button");

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', animateButton, false);
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