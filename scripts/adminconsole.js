const Auth = firebase.auth()
async function getData() {
    document.getElementById("navname").innerHTML = await Auth.currentUser.photoURL;
    document.getElementById("navemail").innerHTML = await Auth.currentUser.email;
}
function logout() {
    Auth.signOut().then(() => {
        window.alert("Logout successfull")
        window.location.href = "/index.html";
    }).catch((error) => {
        window.alert(error.message)
    });
}

//auth change
Auth.onAuthStateChanged((user) => {
    if (user && document.getElementById("navname").innerHTML != "") {
        getData();
    }
    else if (!user) {
        window.location.href = "/index.html";
    }
});

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

                    if (window.location.href.slice(-16) != "studwaiting.html") {
                        window.location.href = "/student/studwaiting.html";
                    }
                }
                else if (data.Allow == 3) {
                    if (window.location.href.slice(-11) != "result.html") {
                        window.location.href = "/student/result.html";
                    }
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

        }
        else if (Auth.currentUser.displayName == "Admin") {
            getData();
        }
        //console.log(Auth.currentUser)
    }
    if (!user || !Auth.currentUser.emailVerified) {
        if (window.location.href.slice(-10) != "index.html" && window.location.href.slice(-11) != "signup.html") {
            window.location.href = "/index.html";
        }
    }
});