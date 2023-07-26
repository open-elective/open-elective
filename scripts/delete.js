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
        console.log("User logged in")

        email.value = ""
        password.value = ""
        Auth.currentUser.delete().then(() => {
            window.alert("Account Deleted Successfully")
        }).catch((error) => {
            throw {
                message: "Error deleting account",
                error: new Error()
            };
        });
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

