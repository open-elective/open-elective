if (window.location.hostname == "openelectiveallocation.web.app" ||
    window.location.hostname == "openelectiveallocation.firebaseapp.com") {
    window.location.href = '/404.html';
}
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
// async function fixmymistake() {

//     const ref = await db.collection("studentprefs").where("School", "==", "SMCEC");
//     const temp = await ref.get();


//     var optionsfromdb;
//     await db.collection("Schools").doc("SMCEC").get().then((doc) => {
//         optionsfromdb = doc.data().SMCEC
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });


//     var coursewithname = {}
//     for (var option in optionsfromdb) {
//         var pair = optionsfromdb[option].split("~");
//         coursewithname[pair[0]] = pair[1];
//     }

//     for (j = 0; j < temp.docs.length; j++) {
//         var temppref = []
//         var fixedpref = []
//         var email = "";
//         var prn = "";
//         if (temp.docs[j].data().mypref[0] != null && temp.docs[j].data().mypref.length==12) {
//             await db.collection("studentprefs").doc(temp.docs[j].id).get().then((doc) => {
//                 temppref = doc.data().mypref
//                 email = doc.data().email
//                 prn = doc.id;
//                 var c = 0
//                 for (i = 0; i < temppref.length; i++) {
//                     if (temppref[i] != "4") {
//                         fixedpref[c] = temppref[i];
//                         c++
//                     }
//                 }
//                 console.log(doc.id, temppref[0], temppref[1], temppref[2], temppref[3], temppref[4], temppref[5], temppref[6], temppref[7], temppref[8], temppref[9], temppref[10], temppref[11])
//                 console.log(doc.id, fixedpref[0], fixedpref[1], fixedpref[2], fixedpref[3], fixedpref[4], fixedpref[5], fixedpref[6], fixedpref[7], fixedpref[8], fixedpref[9], fixedpref[10])
//             }).catch((error) => {
//                 console.log("Error getting document:", error);
//             });
//             await db.collection("studentprefs").doc(temp.docs[j].id).update({
//                 mypref: fixedpref
//             })
//                 .then(() => {
//                     console.log("Document successfully written!");
//                 })
//                 .catch((error) => {
//                     console.error("Error writing document: ", error);
//                 });


//             var body = "Dear  student (" + prn + ") <br/>";
//             body += "<br/>Due to human error, the Cloud Computing course was made available to all the branches. But as per orientation webinar, it is only available for SCET and SEE. We have removed the Cloud Computing from your preferences. This will not affect your other preferences"
//             body += "<br/><br/>Your Updated Preferences :<br/>";
//             var table = '<table style="border: 2px solid black">'
//             for (x = 0; x < fixedpref.length; x++) {
//                 table += '<tr><td style="border: 1px solid black">' + (x + 1).toString() + '</td><td style="border: 1px solid black">' + coursewithname[fixedpref[x]] + "</td></tr>"

//             }
//             table += "</table><br/><br/>"
//             body += table
//             body += "You can recheck or refill the preferences <a href='https://openelective.mitaoe.ac.in/student/studhomepage.html'> here</a>"
//             await Email.send({
//                 Host: "smtp.gmail.com",
//                 Username: "open_elective_allocation@mitaoe.ac.in",
//                 Password: "vllkiklgsawlezwv",
//                 To: email,
//                 From: "open_elective_allocation@mitaoe.ac.in",
//                 Subject: "Updated Preferences",
//                 Body: body,
//             })
//                 .then(function (message) {
//                     console.log("email sent")
//                 });
//             console.log("emailsent")
//         }
//     }
// }