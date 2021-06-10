var progress = document.getElementsByClassName("determinate")[0]
var storedatasd = null;
var storedatacd = null;
// async function addadmin(e) {
//     e.preventDefault()
//     const email = document.getElementById("adminemail")
//     const Name = document.getElementById("adminname")
//     try {
//         if (Name.value.length == 0) {
//             throw {
//                 message: "Please Enter Name",
//                 error: new Error()
//             };
//         }
//         if (email.value.slice(-13) != "@mitaoe.ac.in") {
//             throw {
//                 message: "Invalid Mail-id (Use official mail-id)",
//                 error: new Error()
//             };
//         }
//         var btn = document.getElementById("addadmin");
//         progress.style.visibility = "visible";
//         btn.style.visibility = "hidden";
//         var alreadyexist = false;
//         await db.collection("allow-users").doc(email.value).get().then((doc) => {
//             if (doc.exists) {
//                 alreadyexist = true;
//             }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//         if (alreadyexist) {
//             throw {
//                 message: "User is already admin",
//                 error: new Error()
//             };
//         }
//         await db.collection("allow-users").doc(email.value).set({
//             Name: Name.value
//         })
//             .then(() => {
//                 console.log("Added Admin in Database");
//             })
//             .catch((error) => {
//                 console.error("Error adding Admin in database: ", error);
//             });

//         const result = await Auth.createUserWithEmailAndPassword(email.value, Math.random().toString(36).slice(2))
//         sendVerificationEmail(email.value)
//         await result.user.updateProfile({
//             displayName: "Admin",
//             photoURL: Name.value
//         });


//         Name.value = ""
//         email.value = ""
//         progress.style.visibility = "hidden";
//         btn.style.visibility = "visible";
//         window.alert("Admin Added Successfully. (Please tell new user to check inbox to Set Password)")
//         logout()
//     }
//     catch (err) {
//         if (err.code == "auth/email-already-in-use") {
//             err.message = "Email already exist"
//         }
//         window.alert(err.message);
//         progress.style.visibility = "hidden";
//         btn.style.visibility = "visible";
//     }
// }
// async function sendVerificationEmail(email) {
//     await Auth.sendPasswordResetEmail(email).then(function () {
//         console.log('link sent')
//     }).catch(function (error) {
//         window.alert(error.message)
//     });
// }
// function logout() {
//     Auth.signOut().then(() => {
//         window.alert("Logout successfull")
//         window.location.href = "/index.html";
//     }).catch((error) => {
//         window.alert(error.message)
//     });
// }
async function deleteallstud() {
    document.getElementsByClassName("progress")[0].style.visibility = "visible";


    const tempref = await db.collection("studentData");
    const temp = await tempref.get();
    const len = temp.docs.length
    for (i = 0; i < len; i++) {
        await db.collection("studentData").doc(temp.docs[i].id).delete().then(() => {
            //console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        var percent = (i * 100) / (len - 1)
        progress.style = "width:" + percent.toString() + "%";
    }

    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
    progress.style = "width:0%";
}
async function deleteallpref() {
    document.getElementsByClassName("progress")[0].style.visibility = "visible";
    const tempref = await db.collection("studentprefs");
    const temp = await tempref.get();

    const len = temp.docs.length
    for (i = 0; i < temp.docs.length; i++) {
        await db.collection("studentprefs").doc(temp.docs[i].id).delete().then(() => {
            //console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        var percent = (i * 100) / (len - 1)
        progress.style = "width:" + percent.toString() + "%";
    }
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
    progress.style = "width:0%";
}
async function deleteallcourse() {
    document.getElementsByClassName("progress")[0].style.visibility = "visible";


    const tempref = await db.collection("courseData");
    const temp = await tempref.get();

    const len = temp.docs.length
    for (i = 0; i < temp.docs.length; i++) {
        await db.collection("courseData").doc(temp.docs[i].id).delete().then(() => {
            //console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        var percent = (i * 50) / (len - 1)
        progress.style = "width:" + percent.toString() + "%";
    }


    const tempref1 = await db.collection("Schools");
    const temp1 = await tempref1.get();

    for (i = 0; i < temp.docs.length; i++) {
        await db.collection("Schools").doc(temp1.docs[i].id).delete().then(() => {
            //console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        var percent = (i * 50) / (len - 1)
        progress.style = "width:" + (percent + 50).toString() + "%";
    }
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
    progress.style = "width:0%";
}
async function downloadexcel() {

    progress.className = "indeterminate blue darken-2"
    document.getElementsByClassName("progress")[0].style.visibility = "visible";

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Entire Allocation Data",
        Subject: "Data",
        Author: "Open-Elective-Devlopers",
        CreatedDate: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    };

    if (storedatasd == null) {
        const ref1 = await db.collection("studentData").orderBy("CGPA", "desc");
        storedatasd = await ref1.get();
    }

    if (storedatacd == null) {
        const ref2 = await db.collection("courseData");
        storedatacd = await ref2.get();
    }

    const ref3 = await db.collection("Schools");
    const storedatass = await ref3.get();


    const ref4 = await db.collection("studentprefs");
    const storedatasp = await ref4.get();


    //course data sheet
    var ws_data = [];
    ws_data.push(["Course ID", "Course Name", "Internal Capacity", "Internal Filled", "External Capacity", "External Filled", "Course school", "Course Allowed"]);
    for (i = 0; i < storedatacd.docs.length; i++) {
        data = storedatacd.docs[i].data()
        var temp = ""
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
        ws_data.push([storedatacd.docs[i].id, data.Name, data.InternalCap, data.Intfill, data.Extfill, data.ExternalCap, data.School, temp]);
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

    ws_data.push(["PRN", "School", "Preferences"]);
    for (i = 0; i < storedatasp.docs.length; i++) {
        var myprefstr = storedatasp.docs[i].data().mypref;
        myprefstr.splice(0, 0, storedatasd.docs[i].data().School)
        myprefstr.splice(0, 0, storedatasp.docs[i].id);
        console.log()
        ws_data.push(myprefstr);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Student Preferences");
    wb.Sheets["Student Preferences"] = ws;



    //School sheet
    var ws_data = [];
    ws_data.push(["School", "Allowed Course"]);
    for (i = 0; i < storedatass.docs.length; i++) {
        var school = storedatass.docs[i].data()[storedatass.docs[i].id];
        school.splice(0, 0, storedatass.docs[i].id)
        ws_data.push(school);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.SheetNames.push("Schools");
    wb.Sheets["Schools"] = ws;



    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'EntireData' + dateTime + '.xlsx');
    progress.className = "determinate blue darken-2"
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
}
function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

async function sendemail() {
    try {
        document.getElementsByClassName("progress")[0].style.visibility = "visible";
        if (storedatasd == null) {
            const ref1 = await db.collection("studentData").orderBy("CGPA", "desc");
            storedatasd = await ref1.get();
        }

        if (storedatacd == null) {
            const ref3 = await db.collection("courseData");
            storedatacd = await ref3.get();
        }
        var coursewithname = {};
        for (i = 0; i < storedatacd.docs.length; i++) {
            coursewithname[storedatacd.docs[i].id] = storedatacd.docs[i].data().Name;
        }
        var len = storedatasd.docs.length
        for (i = 0; i < len; i++) {

            var email = "";
            var pref = [];
            var exist = false;
            await db.collection("studentprefs").doc(storedatasd.docs[i].id).get().then((doc) => {
                if (doc.exists) {
                    exist = true;
                    email = doc.data().email
                    pref = doc.data().mypref
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
                exist = false;
            });


            if (exist) {
                var body = "Hey " + storedatasd.docs[i].data().Name + ",<br/>";
                body += "Your allocated Open Elective is " + coursewithname[storedatasd.docs[i].data().alloc] + "<br/>";
                body += "<br/>Your Preferences :<br/>";
                var table = '<table style="border: 2px solid black">'
                for (j = 0; j < pref.length; j++) {
                    table += '<tr><td style="border: 1px solid black">' + (j + 1).toString() + '</td><td style="border: 1px solid black">' + coursewithname[pref[j]] + "</td></tr>"

                }
                table += "</table><br/><br/>"
                body += table
                body += "Check your result <a href='https://openelective.mitaoe.ac.in/student/result.html'> here</a>"
                await Email.send({
                    Host: "smtp.gmail.com",
                    Username: "open_elective_allocation@mitaoe.ac.in",
                    Password: "vllkiklgsawlezwv",
                    To: email,
                    From: "open_elective_allocation@mitaoe.ac.in",
                    Subject: "Results Announced!!!",
                    Body: body,
                })
                    .then(function (message) {
                        console.log("email sent")
                    });
            }
            var percent = (i * 100) / (len - 1)
            progress.style = "width:" + percent.toString() + "%";
        }
    }
    catch (err) {
        console.log(err)
    }
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
    progress.style = "width:0%";
}