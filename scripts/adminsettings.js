async function addadmin(e)
{
    e.preventDefault()
    const email = document.getElementById("adminemail")
    const Name = document.getElementById("adminname")
    try {
        if(Name.value.length == 0) {
            throw {
                message: "Please Enter Name",
                error: new Error()
            };
        }
        if (email.value.slice(-13) != "@mitaoe.ac.in") {
            throw {
                message: "Invalid Mail-id (Use official mail-id)",
                error: new Error()
            };
        }
        var progress = document.getElementById("addadminprogress");
        var btn = document.getElementById("addadmin");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value, "open_elective")
        sendVerificationEmail()
        await result.user.updateProfile({
            displayName: "Admin",
            photoURL: Name.value
        });
        Name.value = ""
        email.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("Admin Added Successfully. (Please check inbox for verification)")
        logout()
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
            console.log(firebase.auth().currentUser);
        })
        .catch(error => {
            console.error(error);
        })
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