async function signup(e) {
    e.preventDefault()
    const email = document.getElementById("signinemail")
    const PRN = document.getElementById("signinPRN")
    const password = document.getElementById("signinpassword");
    try {
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message:  "Invalid Mail-id",
                error: new Error()
            };
        }
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value , password.value)
        sendVerificationEmail()
        await result.user.updateProfile({
            displayName: "User"
        });
        PRN.value = ""
        email.value = ""
        password.value = ""
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