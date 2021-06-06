window.addEventListener('DOMContentLoaded', () => initiate());
async function checkState() {
    db.collection("Misc").doc("State").get().then((doc) => {
        const data = doc.data();
        if (data.Allow == 1) {
            //opened portal
            if (window.location.href.slice(-17) != "studhomepage.html") {
                window.location.href = "/student/studhomepage.html";
            }
        }
        else if (data.Allow == 2) {
             //allocation phase

            //window.location.href="send to result will be published soon"
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
function initiate() {
    db.collection("Misc").doc("State")
        .onSnapshot((doc) => {
            checkState();
        });
}