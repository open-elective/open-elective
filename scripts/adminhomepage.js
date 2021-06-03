
checkcurrentstate()
async function checkcurrentstate() {
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        const state = doc.data()["Allow"]
        hideall()
        if (state == 0) {
            document.getElementsByClassName("stage0")[0].style.display = "block";
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Registration is Closed"
        }
        else if (state == 1) {
            document.getElementsByClassName("stage1")[0].style.display = "block";
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementsByClassName("li")[1].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Select Preferences"
        }
        else if (state == 2) {
            document.getElementsByClassName("stage2")[0].style.display = "block";
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementsByClassName("li")[1].className = "li complete"
            document.getElementsByClassName("li")[2].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Result will be publish soon"
        }
        else if (state == 3) {
            document.getElementsByClassName("stage3")[0].style.display = "block";
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementsByClassName("li")[1].className = "li complete"
            document.getElementsByClassName("li")[2].className = "li complete"
            document.getElementsByClassName("li")[3].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Your Allocated subject is ABC...."
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
function hideall() {
    document.getElementsByClassName("stage0")[0].style.display = "none";
    document.getElementsByClassName("stage1")[0].style.display = "none";
    document.getElementsByClassName("stage2")[0].style.display = "none";
    document.getElementsByClassName("stage3")[0].style.display = "none";
    document.getElementsByClassName("li")[0].className = "li"
    document.getElementsByClassName("li")[1].className = "li"
    document.getElementsByClassName("li")[2].className = "li"
    document.getElementsByClassName("li")[3].className = "li"
}
async function openportal() {
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 0) {
            firebase.firestore().collection("Misc").doc("State").update({
                Allow: 1
            })
                .then(() => {
                    console.log("Document successfully written!");
                    checkcurrentstate()
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
async function closeregistration() {
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 1) {
            firebase.firestore().collection("Misc").doc("State").update({
                Allow: 2
            })
                .then(() => {
                    console.log("Document successfully written!");
                    checkcurrentstate()
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
async function publish() {
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 2) {
            firebase.firestore().collection("Misc").doc("State").update({
                Allow: 3
            })
                .then(() => {
                    console.log("Document successfully written!");
                    checkcurrentstate()
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
async function closeportal() {
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 3) {
            firebase.firestore().collection("Misc").doc("State").update({
                Allow: 0
            })
                .then(() => {
                    console.log("Document successfully written!");
                    checkcurrentstate()
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user){
        firebase.firestore().collection("allow-users").doc(firebase.auth().currentUser.uid).set({
            Allow:1
        })
           .then(() => {
               console.log(" written!");
           })
           .catch((error) => {
               console.error("Error writing document: ", error);
           });
        
    }
});
