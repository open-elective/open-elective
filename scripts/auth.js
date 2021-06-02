async function signup(e) {
e.preventDefault()
const email = document.getElementById("signinemail")
const PRN = document.getElementById("signinPRN")
try {
    if (email.value.slice(-13) != "@mitaoe.ac.in") {
        throw {
            message:  "Invalid Mail-id",
            error: new Error()
        };
    }
    else
    {
        const password = Math.random().toString(36).slice(-8);
            Email.send({
            Host: "smtp.gmail.com",
            Username: "open_elective_allocation@mitaoe.ac.in",
            Password: "21Elective12",
            To: email.value,
            From: "open_elective_allocation@mitaoe.ac.in",
            Subject: "Password for Open Elective Allocation",
            Body: "Password : " + password,
            })
            .then(function (message) {
                alert("Your Password is "+ password)
            });
        
    }
    const result = await firebase.auth().createUserWithEmailAndPassword(email.value , password)
    await result.user.updateProfile({
        displayName: PRN
    });
    email.value = ""
}
catch (err) {
    if (err.code == "auth/email-already-in-use") {
        err.message = "PRN already exist"
    }
    window.alert(err.message);
}

}