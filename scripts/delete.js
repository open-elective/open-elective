if (window.location.hostname == "openelectiveallocation.web.app" ||
    window.location.hostname == "openelectiveallocation.firebaseapp.com") {
    window.location.href = '/404.html';
}
const Auth = firebase.auth()






//Login
async function deleteAccount() {
    const email = document.getElementById("loginemail");
    const password = document.getElementById("loginpassword");
    try {
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message: "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        const result = await Auth.signInWithEmailAndPassword(email.value, password.value)
        if (!Auth.currentUser.emailVerified) {
            sendVerificationEmail()
            throw {
                message: "Email Id not verified.\nPlease check your inbox for verification email",
                error: new Error()
            };
        }
        console.log("User logged in")

        email.value = ""
        password.value = ""
        if (Auth.currentUser.displayName == "User") {
            var imavaliduser = true;
            await firebase.firestore().collection("studentData").doc(Auth.currentUser.photoURL).get().then((doc) => {
                if (!doc.exists) {
                    imavaliduser = false;
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            if (!imavaliduser) {
                throw {
                    message: "You are not in our database, Please contact concerning faculty",
                    error: new Error()
                };
            }


            //code here

            Auth.currentUser.delete().then(() => {
                // User deleted.
                window.alert("Account Deleted Successfully")
            }).catch((error) => {
                // An error ocurred
                // ...
                throw {
                    message: "Error deleting account",
                    error: new Error()
                };
            });


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
    }
}

const sendVerificationEmail = () => {
    Auth.currentUser.sendEmailVerification()
        .then(() => {
            //console.log('Verification Email Sent Successfully !');
        })
        .catch(error => {
            console.error(error);
        })
}

