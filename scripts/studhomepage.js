var progress = document.getElementById("submitprogress");
progress.style.visibility = "visible";
var optionsfromdb;
var mypref = []
var prn = ""
var namenew = ""
window.addEventListener('DOMContentLoaded', () => initiate());
async function checkState() {

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
                //opened portal
                fillpage()
            }
            else if (data.Allow == 2) {
                //allocation phase

                if (window.location.href.slice(-16) != "studwaiting.html") {
                    window.location.href = "/student/studwaiting.html";
                }
            }
            else if (data.Allow == 3) {
                if (window.location.href.slice(-11) != "result.html") {
                    window.location.href = "/student/result.html";
                }
            }
            progress.style.visibility = "hidden";
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    catch (err) {
        window.alert(err.message)
        if (!imavaliduser) {
            Auth.signOut().then(() => {
                window.alert("Logout successfull")
            }).catch((error) => {
                window.alert(error.message)
            });
        }
    }
}
function initiate() {
    db.collection("Misc").doc("State")
        .onSnapshot((doc) => {
            checkState();
        });
}
async function fillpage() {


    var preffortable;

    prn = await firebase.auth().currentUser.photoURL;
    var name = "";
    var school = "";
    var CGPA = 0;


    await db.collection("studentData").doc(prn).get().then((doc) => {
        const data = doc.data();
        school = data.School
        CGPA = data.CGPA
        name = data.Name
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    namenew = name;
    document.getElementById("dispPRN").innerHTML += " " + prn;
    document.getElementById("dispname").innerHTML += " " + name;
    document.getElementById("dispcgpa").innerHTML += " " + CGPA;
    document.getElementById("dispschool").innerHTML += " " + school;


    //get pref is available
    await firebase.firestore().collection("studentprefs").doc(prn).get().then((doc) => {
        if (doc.exists) {
            preffortable = doc.data().mypref;
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    //get course name
    var options = []
    await db.collection("Schools").doc(school).get().then((doc) => {
        options = doc.data()[school]
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    optionsfromdb = options;

    if (preffortable[0] != null) {
        console.log("yes")
        coursedict = {}
        for (var option in optionsfromdb) {
            var pair = options[option].split("~");
            coursedict[pair[0]] = pair[1];
        }

        for (i = 0; i < preffortable.length; i++) {
            addCourseTable(i+1, coursedict[preffortable[i]])
        }
    }
    else {
        console.log("No")
        var dd = document.getElementById("schooldd");
        for (var option in optionsfromdb) {
            var pair = options[option].split("~");
            var newOption = document.createElement("option");
            newOption.value = pair[0];
            newOption.innerHTML = pair[1];
            dd.options.add(newOption);
        }
    }
}
function selectpref() {
    var dd = document.getElementById("schooldd");
    // console.log(dd.value)
    var value = dd.options[dd.selectedIndex].value;// get selected option value
    var text = dd.options[dd.selectedIndex].text;
    dd.remove(dd.selectedIndex);
    addCourseTable(value, text)
}
function addCourseTable(cno, cname) {
    var table = document.getElementById("preftable");
    var row = table.insertRow(document.getElementById("preftable").rows.length - 1);
    var cnot = row.insertCell(0);
    var cnamet = row.insertCell(1);
    cnot.innerHTML = document.getElementById("preftable").rows.length - 2;
    cnamet.innerHTML = cname;
    mypref.push(cno)
    if (mypref.length == optionsfromdb.length) {
        document.getElementById("submitprefbtn").className = "waves-effect waves-light btn blue darken-2"
    }
}
function resetcourses() {
    var dd = document.getElementById("schooldd");
    for (i = dd.length - 1; i > 0; i--) {
        dd.remove(i);
    }
    for (var option in optionsfromdb) {
        var pair = optionsfromdb[option].split("~");
        var newOption = document.createElement("option");
        newOption.value = pair[0];
        newOption.innerHTML = pair[1];
        dd.options.add(newOption);
    }
    var rows = document.getElementById("preftable").rows.length;
    for (i = 2; i < rows; i++)
        document.getElementById("preftable").deleteRow(1);
    mypref = []
    document.getElementById("submitprefbtn").className = "waves-effect waves-light btn blue darken-2 disabled"
}
async function submitpref() {
    progress.style.visibility = "visible";
    try {
        if (mypref.length == optionsfromdb.length) {
            var d = new Date();
            var n = d.getTime();
            await db.collection("studentprefs").doc(prn).update({
                mypref,
                Time: n
            })
                .then(() => {
                    sendemail()
                    window.alert("Your Response is recorded")
                })
                .catch((error) => {
                    console.error("Error adding Data in database: ", error);
                });
        }
        else {
            throw {
                message: "Please select all the courses from dropdown",
                error: new Error()
            };
        }
    }
    catch (err) {
        window.alert(err.message)
    }
    progress.style.visibility = "hidden";
}
async function sendemail() {
    try {
        var coursewithname = {}
        for (var option in optionsfromdb) {
            var pair = optionsfromdb[option].split("~");
            coursewithname[pair[0]] = pair[1];
        }
        var email = "";
        await db.collection("studentprefs").doc(prn).get().then((doc) => {
            if (doc.exists) {
                email = doc.data().email
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        var body = "Hey " + namenew + ",<br/>";
        body += "<br/>Your Preferences :<br/>";
        var table = '<table style="border: 2px solid black">'
        for (j = 0; j < mypref.length; j++) {
            table += '<tr><td style="border: 1px solid black">' + (j + 1).toString() + '</td><td style="border: 1px solid black">' + coursewithname[mypref[j]] + "</td></tr>"

        }
        table += "</table><br/><br/>"
        body += table
        body += "You can refill the preferences if you are not happy with current preferences <a href='https://openelective.mitaoe.ac.in/student/result.html'> here</a>"
        await Email.send({
            Host: "smtp.gmail.com",
            Username: "open_elective_allocation@mitaoe.ac.in",
            Password: "vllkiklgsawlezwv",
            To: email,
            From: "open_elective_allocation@mitaoe.ac.in",
            Subject: "Your Preferences",
            Body: body,
        })
            .then(function (message) {
                console.log("email sent")
            });

    }
    catch (err) {
        console.log(err)
    }
}