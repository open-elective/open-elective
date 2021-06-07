var progress = document.getElementById("addadminprogress");
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
        var btn = document.getElementById("addadmin");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        var alreadyexist = false;
        await db.collection("allow-users").doc(email.value).get().then((doc) => {
            if (doc.exists) {
                alreadyexist = true;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        if (alreadyexist) {
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
async function sendVerificationEmail(email) {
    await Auth.sendPasswordResetEmail(email).then(function () {
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
async function deleteallstud() {
    progress.style.visibility = "visible";
    var batch = firebase.firestore().batch()
    await db.collection("studentData").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("studentData").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    });
    progress.style.visibility = "hidden";
}
async function deleteallpref() {
    progress.style.visibility = "visible";
    var batch = firebase.firestore().batch()
    await db.collection("studentprefs").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("studentprefs").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    });
    progress.style.visibility = "hidden";
}
async function deleteallcourse() {
    progress.style.visibility = "visible";
    var batch = firebase.firestore().batch()
    await db.collection("courseData").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("courseData").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    });
    await db.collection("Schools").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("Schools").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    });
    progress.style.visibility = "hidden";
}
function downloadexcel() {
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS Tutorial",
        Subject: "Test",
        Author: "Red Stapler",
        CreatedDate: new Date(2017, 12, 19)
    };
    wb.SheetNames.push("Test Sheet1");
    wb.SheetNames.push("Test Sheet2");
    var ws_data = [['hello', 'world']];
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Test Sheet1"] = ws;
    wb.Sheets["Test Sheet2"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
}
function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}
