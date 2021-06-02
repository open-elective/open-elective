async function signup(e) {
e.preventDefault()
const email = document.getElementById("signinemail")
const PRN = document.getElementById("signinPRN")
var password = document.getElementById("signinpassword");
try {
    if (email.value.slice(-13) != "@mitaoe.ac.in") {
        throw {
            message:  "Invalid Mail-id",
            error: new Error()
        };
    }
    else
    {
        password = Math.random().toString(36).slice(-8);        
    }
    const result = await firebase.auth().createUserWithEmailAndPassword(email.value , PRN.value)
    sendVerificationEmail()
}
catch (err) {
    if (err.code == "auth/email-already-in-use") {
        err.message = "Email already exist"
    }
    window.alert(err.message);
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