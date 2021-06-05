async function addadmin(e) {
    e.preventDefault()
    const email = document.getElementById("adminemail")
    const Name = document.getElementById("adminname")
    try {
        if (Name.value.length == 0) {
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
        var alreadyexist =false;
        await firebase.firestore().collection("allow-users").doc(email.value).get().then((doc) => {
            if (doc.exists) {
               alreadyexist = true;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        if(alreadyexist)
        {
            throw {
                message: "User is already admin",
                error: new Error()
            };
        }
        await firebase.firestore().collection("allow-users").doc(email.value).set({
            Name: Name.value
        })
            .then(() => {
                console.log("Added Admin in Database");
                checkcurrentstate()
            })
            .catch((error) => {
                console.error("Error adding Admin in database: ", error);
            });
            
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value, Math.random().toString(36).slice(2))
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
