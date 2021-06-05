
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
        await db.collection("allow-users").doc(email.value).get().then((doc) => {
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
        await db.collection("allow-users").doc(email.value).set({
            Name: Name.value
        })
            .then(() => {
                console.log("Added Admin in Database");
            })
            .catch((error) => {
                console.error("Error adding Admin in database: ", error);
            });
            
        const result = await Auth.createUserWithEmailAndPassword(email.value, Math.random().toString(36).slice(2))
        sendVerificationEmail(email.value)
        await result.user.updateProfile({
            displayName: "Admin",
            photoURL: Name.value
        });

        
        Name.value = ""
        email.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("Admin Added Successfully. (Please tell new user to check inbox to Set Password)")
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
const sendVerificationEmail = (email) => {
    Auth.sendPasswordResetEmail(email).then(function () {
        console.log('link sent')
    }).catch(function (error) {
        window.alert(error.message)
    });
}
function logout() {
    Auth.signOut().then(() => {
        window.alert("Logout successfull")
        window.location.href = "/index.html";
    }).catch((error) => {
        window.alert(error.message)
    });
}