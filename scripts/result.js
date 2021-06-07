window.addEventListener('DOMContentLoaded', () => initiate());
async function checkState() {
    db.collection("Misc").doc("State").get().then((doc) => {
        const data = doc.data();
        if (data.Allow == 0) {
            //closed portal
            if (window.location.href.slice(-16) != "studlanding.html") {
                window.location.href = "/student/studlanding.html";
            }
        }
        else if (data.Allow == 1) {
            //allocation phase

            if (window.location.href.slice(-17) != "studhomepage.html") {
                window.location.href = "/student/studhomepage.html";
            }
        }
        else if (data.Allow == 2) {
            if (window.location.href.slice(-16) != "studwaiting.html") {
                window.location.href = "/student/studwaiting.html";
            }
        }
        progress.style.visibility = "hidden";
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
function initiate() {
    db.collection("Misc").doc("State")
        .onSnapshot((doc) => {
            checkState();
        });
}