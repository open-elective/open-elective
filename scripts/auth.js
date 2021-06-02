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
        var progress = document.getElementById("signinprogress");
        var btn = document.getElementById("signinbtn");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value , password.value)
        sendVerificationEmail()
        await result.user.updateProfile({
            displayName: "User"
        });
        PRN.value = ""
        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
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