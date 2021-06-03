
//Signup
async function signup(e) {
    e.preventDefault()
    const email = document.getElementById("signinemail")
    const PRN = document.getElementById("signinPRN")
    const password = document.getElementById("signinpassword");
    try {
        if(email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message:  "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        if(PRN.value.length != 10)
        {
            throw {
                message:  "Invalid PRN (PRN should be 10 digits)",
                error: new Error()
            }; 
        }
        var progress = document.getElementById("signinprogress");
        var btn = document.getElementById("signinbtn");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value , password.value)
        sendVerificationEmail()
        await result.user.updateProfile({
            displayName: "User",
            photoURL: PRN.value
        });
        PRN.value = ""
        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("Signup successful.\nPlease check your inbox to verify your email id")
        window.location.href = "index.html";
    }
    catch (err) {
        if (err.code == "auth/email-already-in-use") {
            err.message = "Email already exist"
        }
        window.alert(err.message);
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }
}
const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification()
    .then(() => {
        console.log('Verification Email Sent Successfully !');    
    })
    .catch(error => {
        console.error(error);
    })
}






//StudLogin
async function studlogin(e) {
    e.preventDefault()
    const email = document.getElementById("studemail");
    const password = document.getElementById("studpassword");
    try {
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message: "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        var progress = document.getElementById("loginprogress");
        var btn = document.getElementById("studlogin");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";

        const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        if(!firebase.auth().currentUser.emailVerified)
        {
            sendVerificationEmail()
            throw {
                message: "Email Id not verified.\nPlease check your inbox for verification email",
                error: new Error()
            };
        }
        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("login successful")
        console.log(firebase.auth().currentUser)
        window.location.href = "studhomepage.html";
    }
    catch (err) {
        if (err.code == "auth/wrong-password") {
            err.message = "Incorrect Password"
        }
        if (err.code == "auth/user-not-found") {
            err.message = "Email does not exist, Please sign-up"
        }
        window.alert(err.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }
}

//AdminLogin
async function adminlogin(e) {
    e.preventDefault()
    const email = document.getElementById("adminemail");
    const password = document.getElementById("adminpassword");
    try {
        // if (email.value.slice(-13) != "@mitaoe.ac.in") {
        //     throw {
        //         message: "Invalid Mail-id (Use official mail-id)",
        //         error: new Error()
        //     };
        // }
        var progress = document.getElementById("loginprogress");
        var btn = document.getElementById("studlogin");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";

        const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        if(!firebase.auth().currentUser.emailVerified)
        {
            sendVerificationEmail()
            throw {
                message: "Email Id not verified.\nPlease check your inbox for verification email",
                error: new Error()
            };
        }
        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("login successful")
        console.log(firebase.auth().currentUser)
        window.location.href = "studhomepage.html";
    }
    catch (err) {
        if (err.code == "auth/wrong-password") {
            err.message = "Incorrect Password"
        }
        if (err.code == "auth/user-not-found") {
            err.message = "Email does not exist, Please sign-up"
        }
        window.alert(err.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }
}



//log out
function logout() {
    firebase.auth().signOut().then(() => {
        window.alert("Logout successfull")
        window.location.href = "index.html";
    }).catch((error) => {
        window.alert(error.message)
    });
}





//check if loggedin
firebase.auth().onAuthStateChanged((user) => {
    if (user && firebase.auth().currentUser.emailVerified ) {
        if(window.location.href.slice(-17) != "studhomepage.html")
        {
            window.location.href = "studhomepage.html";
        }
    } 
});


//forget Password
function forgotpass(e)
{
    e.preventDefault()
    var auth = firebase.auth();
    var emailAddress = document.getElementById("studresetemail").value;
    var progress = document.getElementById("resetprogress");
    var btn = document.getElementById("forgotbtn");
    progress.style.visibility = "visible";
    btn.style.visibility = "hidden";

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        window.alert("Reset Link sent")
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }).catch(function(error) {
        window.alert(error.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    });
}