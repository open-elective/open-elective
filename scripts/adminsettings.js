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
async function downloadexcel() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Entire Allocation Data",
        Subject: "Data",
        Author: "Open-Elective-Devlopers",
        CreatedDate: new Date(today.getFullYear(), today.getMonth()+1, today.getDate())
    };

    const ref1 = await db.collection("studentData").orderBy("CGPA", "desc");
    storedatasd = await ref1.get();

    const ref2 = await db.collection("courseData");
    storedatacd = await ref2.get();

    const ref3 = await db.collection("Schools");
    storedatass = await ref3.get();

    const ref4 = await db.collection("studentprefs");
    storedatasp = await ref4.get();


    //course data sheet
    var ws_data = [];
    ws_data.push(["Course ID","Course Name", "Internal Capacity","Internal Filled","External Capacity", "External Filled", "Course school", "Course Allowed"]);
    for (i = 0; i < storedatacd.docs.length; i++) {
        data = storedatacd.docs[i].data()
        var temp=""
        if (data.All) {
            temp = "All"
        }
        else {
            if (data.SCET) {
                temp = temp + "SCET" + ", "
            }
            if (data.SEE) {
                temp = temp + "SEE" + ", "
            }
            if (data.SMCEM) {
                temp = temp + "SMCEM" + ", "
            }
            if (data.SMCEC) {
                temp = temp + "SMCEC" + ", "
            }
            if (data.SCE) {
                temp = temp + "SCE" + ", "
            }
        }
        ws_data.push([storedatacd.docs[i].id,data.Name, data.InternalCap, data.Intfill, data.Extfill, data.ExternalCap, data.School, temp]);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Course Data");
    wb.Sheets["Course Data"] = ws;



    //student data sheet
    var ws_data = [];
    ws_data.push(["PRN", "Name", "CGPA", "School", "Allocation"]);
    for (i = 0; i < storedatasd.docs.length; i++) {
        ws_data.push([storedatasd.docs[i].id, storedatasd.docs[i].data().Name, storedatasd.docs[i].data().CGPA, storedatasd.docs[i].data().School, storedatasd.docs[i].data().alloc]);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Student Data");
    wb.Sheets["Student Data"] = ws;



    //student pref sheet
    var ws_data = [];
    ws_data.push(["PRN", "Preferences"]);
    for (i = 0; i < storedatasp.docs.length; i++) {
        var myprefstr = storedatasp.docs[i].data().mypref.join(', ');
        ws_data.push([storedatasp.docs[i].id, myprefstr]);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Student Preferences");
    wb.Sheets["Student Preferences"] = ws;



    //School sheet
    var ws_data = [];
    ws_data.push(["School", "Allowed Course"]);
    for (i = 0; i < storedatass.docs.length; i++) {
        var school = storedatass.docs[i].data()[storedatass.docs[i].id].join('# ');
        ws_data.push([storedatass.docs[i].id,school]);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Schools");
    wb.Sheets["Schools"] = ws;



    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'EntireData'+dateTime+'.xlsx');
}
function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}
