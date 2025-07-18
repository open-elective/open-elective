window.addEventListener('DOMContentLoaded', () => initiate());
var progress = document.getElementById("progressloading");
async function checkState() {
    progress.style.visibility = "visible";
    try {
        var imavaliduser = true;
        await firebase.firestore().collection("studentData").doc(Auth.currentUser.photoURL).get().then((doc) => {
            if (!doc.exists) {
                imavaliduser = false;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        if (!imavaliduser) {
            throw {
                message: "You are not in our database, Please contact concerning faculty",
                error: new Error()
            };
        }
        await db.collection("Misc").doc("State").get().then((doc) => {
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
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        filldata()
    }
    catch (err) {
        if (err.code == "auth/wrong-password") {
            err.message = "Incorrect Password"
        }
        if (err.code == "auth/user-not-found") {
            err.message = "Email does not exist, Please sign-up"
        }
        window.alert(err.message)
    }

}
function initiate() {
    db.collection("Misc").doc("State")
        .onSnapshot((doc) => {
            checkState();
        });
}


async function filldata() {

    prn = await firebase.auth().currentUser.photoURL;
    var name = "";
    var school = "";
    var CGPA = 0;
    var alloc = 0;
    var pref;
    var courseData;
    await db.collection("studentData").doc(prn).get().then((doc) => {
        const data = doc.data();
        school = data.School
        CGPA = data.CGPA
        name = data.Name
        alloc = data.alloc
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    document.getElementById("dispPRN").innerHTML += " " + prn;
    document.getElementById("dispname").innerHTML += " " + name;
    document.getElementById("dispcgpa").innerHTML += " " + CGPA;
    document.getElementById("dispschool").innerHTML += " " + school;
    await db.collection("studentprefs").doc(prn).get().then((doc) => {
        pref = doc.data().mypref
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


    await db.collection("Schools").doc(school).get().then((doc) => {
        courseData = doc.data()[school];
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    var prefwithname = {};
    for (var option in courseData) {
        var pair = courseData[option].split("~");
        prefwithname[pair[0]] = pair[1];

    }
    for (i = 0; i < pref.length; i++) {
        addCourseTable(i + 1, prefwithname[pref[i]])
    }

    if (alloc != 0) {
        const result = prefwithname[alloc] ? prefwithname[alloc] : prefwithname["0"+alloc];
        document.getElementById("myallocation").innerHTML = result;
    }
    else {
        document.getElementById("myallocation").innerHTML = "No Allocation"
    }
    progress.style.visibility = "hidden";
}
function addCourseTable(cno, cname) {
    var table = document.getElementById("preftable");
    var row = table.insertRow(document.getElementById("preftable").rows.length - 1);
    var cnot = row.insertCell(0);
    var cnamet = row.insertCell(1);
    cnot.innerHTML = cno
    cnamet.innerHTML = cname;
}
