const Auth = firebase.auth()
//Signup
async function signup(e) {
    e.preventDefault()
    const email = document.getElementById("signinemail")
    const PRN = document.getElementById("signinPRN")
    const password = document.getElementById("signinpassword");
    try {
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message: "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        if (PRN.value.length != 10) {
            throw {
                message: "Invalid PRN (PRN should be 10 digits)",
                error: new Error()
            };
        }
        var progress = document.getElementById("signinprogress");
        var btn = document.getElementById("signinbtn");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await Auth.createUserWithEmailAndPassword(email.value, password.value)
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
        window.location.href = "/index.html";
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
    Auth.currentUser.sendEmailVerification()
        .then(() => {
            console.log('Verification Email Sent Successfully !');
        })
        .catch(error => {
            console.error(error);
        })
}






//Login
async function login(e) {
    e.preventDefault()
    const email = document.getElementById("loginemail");
    const password = document.getElementById("loginpassword");
    try {
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message: "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        var progress = document.getElementById("loginprogress");
        var btn = document.getElementById("login");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await Auth.signInWithEmailAndPassword(email.value, password.value)
        if (!Auth.currentUser.emailVerified) {
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
        if (Auth.currentUser.displayName == "User") {
            if (window.location.href.slice(-16) != "studlanding.html") {
                window.location.href = "/student/studlanding.html";
            }
        }
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
    Auth.signOut().then(() => {
        window.alert("Logout successfull")
    }).catch((error) => {
        window.alert(error.message)
    });
}





//check if loggedin
Auth.onAuthStateChanged((user) => {
    if (user && Auth.currentUser.emailVerified) {
        if (Auth.currentUser.displayName == "User") {
            firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
                const data = doc.data();
                if (data.Allow == 0) {
                    if (window.location.href.slice(-16) != "studlanding.html") {
                        window.location.href = "/student/studlanding.html";
                    }
                }
                else if (data.Allow == 1) {
                    if (window.location.href.slice(-17) != "studhomepage.html") {
                        window.location.href = "/student/studhomepage.html";
                    }
                }
                else if (data.Allow == 2) {
                         
                    //window.location.href="send to result will be published soon"
                }
                else if (data.Allow == 3) {
                    //window.location.href="send to show result page"
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            
        }
        else if(Auth.currentUser.displayName == "Admin")
        {
            if (window.location.href.slice(-18) != "adminhomepage.html") {
                window.location.href = "/admin/adminhomepage.html";
            }
        }
        console.log(Auth.currentUser)
    }
    if(!user || !Auth.currentUser.emailVerified )
    {
        if (window.location.href.slice(-10) != "index.html" && window.location.href.slice(-11) != "signup.html") {
            window.location.href = "/index.html";
        }
    }
});


//forget Password
function forgotpass(e) {
    e.preventDefault()
    var emailAddress = document.getElementById("studresetemail").value;
    var progress = document.getElementById("resetprogress");
    var btn = document.getElementById("forgotbtn");
    progress.style.visibility = "visible";
    btn.style.visibility = "hidden";

    Auth.sendPasswordResetEmail(emailAddress).then(function () {
        window.alert("Reset Link sent")
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }).catch(function (error) {
        window.alert(error.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    });
}