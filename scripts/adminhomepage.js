hideall()
window.addEventListener('DOMContentLoaded', () => checkcurrentstate());
async function checkcurrentstate() {
    await db.collection("Misc").doc("State").get().then((doc) => {
        const state = doc.data()["Allow"]
        hideall()
        if (state == 0) {
            document.getElementsByClassName("btn")[1].className = "waves-effect waves-light btn blue darken-2"
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Registration is Closed"
        }
        else if (state == 1) {
            document.getElementsByClassName("btn")[2].className = "waves-effect waves-light btn blue darken-2"
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementsByClassName("li")[1].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Select Preferences"
        }
        else if (state == 2) {
            document.getElementsByClassName("btn")[1].className = "waves-effect waves-light btn blue darken-2"
            document.getElementsByClassName("btn")[3].className = "waves-effect waves-light btn blue darken-2"
            document.getElementsByClassName("li")[0].className = "li complete"
            document.getElementsByClassName("li")[1].className = "li complete"
            document.getElementsByClassName("li")[2].className = "li complete"
            document.getElementById("studviewtext").innerHTML = "Result will be publish soon"
        }
        else if (state == 3) {
            document.getElementsByClassName("btn")[1].className = "waves-effect waves-light btn blue darken-2"
            document.getElementsByClassName("btn")[4].className = "waves-effect waves-light btn blue darken-2"
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
    document.getElementsByClassName("btn")[1].className = "waves-effect waves-light btn blue darken-2 disabled"
    document.getElementsByClassName("btn")[2].className = "waves-effect waves-light btn blue darken-2 disabled"
    document.getElementsByClassName("btn")[3].className = "waves-effect waves-light btn blue darken-2 disabled"
    document.getElementsByClassName("btn")[4].className = "waves-effect waves-light btn blue darken-2 disabled"
    document.getElementsByClassName("li")[0].className = "li"
    document.getElementsByClassName("li")[1].className = "li"
    document.getElementsByClassName("li")[2].className = "li"
    document.getElementsByClassName("li")[3].className = "li"
}
async function openportal() {
    await db.collection("Misc").doc("State").get().then((doc) => {
        const data = doc.data();
        if (data.Allow == 0) {
            db.collection("Misc").doc("State").update({
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
        if (data.Allow == 2) {
            db.collection("Misc").doc("State").update({
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
        if (data.Allow == 3) {
            if (confirm('Are you sure, you want to open the portal? The results will be unpublished')) {
                db.collection("Misc").doc("State").update({
                    Allow: 1
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        checkcurrentstate()
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
              } else {
                
              }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
async function closeregistration() {
    await db.collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 1) {
            db.collection("Misc").doc("State").update({
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
    await db.collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 2) {
            db.collection("Misc").doc("State").update({
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
    await db.collection("Misc").doc("State").get().then((doc) => {
        if (doc.data()["Allow"] == 3) {
            db.collection("Misc").doc("State").update({
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
