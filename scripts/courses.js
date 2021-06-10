window.addEventListener('DOMContentLoaded', () => retriveCourseData());

function retriveCourseData() {
    var progress = document.getElementById("cprogress")
    progress.style.visibility = "visible";
    var rows = document.getElementById("courset").rows.length;
    for (i = 2; i < rows; i++)
        document.getElementById("courset").deleteRow(1);
    db.collection("courseData")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var temp = ""
                const data = doc.data();
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
                addCourseTable(doc.id, data.Name, data.InternalCap, data.ExternalCap, data.School, temp)
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    progress.style.visibility = "hidden";
}
const all = document.getElementById('c1')
all.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        removeallcheck()
        blockall("disabled")
    } else {
        blockall("")
        ddchanged()
    }
})
function ddchanged() {
    // if (document.getElementById("c1").checked)
    // {
    //     document.getElementById("c1").disabled = ""
    //     return;
    // }
    blockall("")
    removeallcheck()

    //newlyadded
    document.getElementById("c1").disabled = ""
    document.getElementById("c1").checked = false;


    var schooldd = document.getElementById("schooldd");
    var dd = schooldd.selectedIndex;
    if (dd == 1) {
        document.getElementById("c2").checked = true;
        document.getElementById("c2").disabled = "disabled"
    }
    else if (dd == 2) {
        document.getElementById("c3").checked = true;
        document.getElementById("c3").disabled = "disabled"
    }
    else if (dd == 3) {
        document.getElementById("c4").checked = true;
        document.getElementById("c4").disabled = "disabled"
    }
    else if (dd == 4) {
        document.getElementById("c5").checked = true;
        document.getElementById("c5").disabled = "disabled"
    }
    else if (dd == 5) {
        document.getElementById("c6").disabled = "disabled"
        document.getElementById("c6").checked = true;
    }
    else if (dd == 6) {
        document.getElementById("c1").disabled = "disabled"
        document.getElementById("c1").checked = true;
        removeallcheck()
        blockall("disabled")
    }
}
async function addcourse() {
    try {
        var progress = document.getElementById("cprogress")
        progress.style.visibility = "visible";
        var cname = document.getElementById("cname").value;
        var cno = document.getElementById("cno").value;
        var cincapa = document.getElementById("cincapa").value;
        var cextcapa = document.getElementById("cextcapa").value;
        var schooldd = document.getElementById("schooldd");
        var c1 = document.getElementById("c1");
        var c2 = document.getElementById("c2");
        var c3 = document.getElementById("c3");
        var c4 = document.getElementById("c4");
        var c5 = document.getElementById("c5");
        var c6 = document.getElementById("c6");
        var dd = schooldd.selectedIndex;
        var school = ""
        //skip if All check box is selected
        var skip = false;
        if (c2.checked && c3.checked && c4.checked && c5.checked && c6.checked) {
            skip = true;
        }
        if (dd == 1)
            school = "SCET"
        else if (dd == 2)
            school = "SEE"
        else if (dd == 3)
            school = "SMCEM"
        else if (dd == 4)
            school = "SMCEC"
        else if (dd == 5)
            school = "SCE"
        else if (dd == 6)
            school = "SHES"

        if (!cname || !cno || !cincapa || !cextcapa || !schooldd) {
            throw {
                message: "Please fill All details",
                error: new Error()
            };
        }
        var edit = true;
        await db.collection("Misc").doc("State").get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.Allow == 1) {
                    if (!confirm("Portal is already opended for students, Editing/Adding may cause conflict. Do you still want to continue?")) {
                        edit = false;
                    }
                }
                else if (data.Allow == 2) {
                    if (!confirm("Portal is already closed, Editing/Adding may cause conflict. Do you still want to continue?")) {
                        edit = false;
                    }
                }
                else if (data.Allow == 3) {
                    if (!confirm("Result is already Published, Adding course won't affect allocation now. Do you still want to continue?")) {
                        edit = false;
                    }
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        await db.collection("courseData").doc(cno.toString()).get().then((doc) => {
            if (doc.exists) {
                if (!confirm('This course already exist. Are you sure you want to edit the course data?')) {
                    edit = false;
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        if (!edit) {
            throw {
                message: "We revert the changes.",
                error: new Error()
            };
        }
        await db.collection("courseData").doc(cno.toString()).set({
            Name: cname.toString(),
            InternalCap: parseInt(cincapa),
            ExternalCap: parseInt(cextcapa),
            School: school,
            All: c1.checked || skip,
            SCET: c2.checked && !skip,
            SEE: c3.checked && !skip,
            SMCEM: c4.checked && !skip,
            SMCEC: c5.checked && !skip,
            SCE: c6.checked && !skip,
            Intfill: 0,
            Extfill: 0
        })
            .then(() => {
                console.log("Added in Database");
                updateschooldata()
                retriveCourseData()
            })
            .catch((error) => {
                console.error("Error adding Data in database: ", error);
            });

    }
    catch (err) {
        window.alert(err.message)
    }
    removeall()
    document.getElementById("c1").disabled = "";
    progress.style.visibility = "hidden";
}
function removeall() {
    blockall("")
    focusall("")
    document.getElementById("cname").value = "";
    document.getElementById("cno").value = "";
    document.getElementById("cincapa").value = "";
    document.getElementById("cextcapa").value = "";
    document.getElementById("schooldd").M_FormSelect.input.value = "Choose your option"
    document.getElementById("schooldd").selectedIndex = 0;
    document.getElementById("c1").checked = false;
    removeallcheck()
}
function removeallcheck() {
    document.getElementById("c2").checked = false;
    document.getElementById("c3").checked = false;
    document.getElementById("c4").checked = false;
    document.getElementById("c5").checked = false;
    document.getElementById("c6").checked = false;
}
function blockall(b) {
    document.getElementById("c2").disabled = b;
    document.getElementById("c3").disabled = b;
    document.getElementById("c4").disabled = b;
    document.getElementById("c5").disabled = b;
    document.getElementById("c6").disabled = b;
}

function addCourseTable(cno, cname, intcap, extcap, cscl, open) {
    var table = document.getElementById("courset");
    var row = table.insertRow(1);
    var cnot = row.insertCell(0);
    var cnamet = row.insertCell(1);
    var intcapt = row.insertCell(2);
    var extcapt = row.insertCell(3);
    var csclt = row.insertCell(4);
    var opent = row.insertCell(5);
    cnot.innerHTML = cno;
    cnamet.innerHTML = cname;
    intcapt.innerHTML = intcap;
    extcapt.innerHTML = extcap;
    csclt.innerHTML = cscl;
    opent.innerHTML = open;
}
async function editcourse() {
    removeall()
    try {
        var progress = document.getElementById("cprogress")
        progress.style.visibility = "visible";
        var cno = document.getElementById("cedit");
        if (!cno.value) {
            throw {
                message: "Please fill Course No.",
                error: new Error()
            };
        }
        await db.collection("courseData").doc(cno.value.toString()).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                var schooltemp = data.School;
                var s = 0
                if (schooltemp == "SCET") {
                    document.getElementById("c2").disabled = "disabled"
                    s = 1
                }
                else if (schooltemp == "SEE") {
                    document.getElementById("c3").disabled = "disabled"
                    s = 2
                }
                else if (schooltemp == "SCE") {
                    document.getElementById("c6").disabled = "disabled"
                    s = 5
                }
                else if (schooltemp == "SHES") {
                    document.getElementById("c1").disabled = "disabled"
                    s = 6
                }

                if (schooltemp == "SMCEC") {
                    schooltemp = "SMCE(Civil)"
                    document.getElementById("c5").disabled = "disabled"
                    s = 4
                }
                else if (schooltemp == "SMCEM") {
                    schooltemp = "SMCE(Mechanical)"
                    document.getElementById("c4").disabled = "disabled"
                    s = 3
                }
                document.getElementById("cname").value = data.Name;
                document.getElementById("cno").value = doc.id;
                document.getElementById("cincapa").value = data.InternalCap;
                document.getElementById("cextcapa").value = data.ExternalCap;
                document.getElementById("schooldd").M_FormSelect.input.value = schooltemp;
                document.getElementById("schooldd").selectedIndex = s;
                document.getElementById("c1").checked = data.All;
                document.getElementById("c2").checked = data.SCET;
                document.getElementById("c3").checked = data.SEE;
                document.getElementById("c4").checked = data.SMCEM;
                document.getElementById("c5").checked = data.SMCEC;
                document.getElementById("c6").checked = data.SCE;
                if (data.All) {
                    removeallcheck()
                    blockall("disabled")
                }
                focusall("active")
            }
            else {
                window.alert("Course dosen't exist");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }
    catch (err) {
        window.alert(err.message)
    }
    removeextra()
    progress.style.visibility = "hidden";
}
function focusall(a) {
    document.getElementsByTagName("label")[0].className = a
    document.getElementsByTagName("label")[1].className = a
    document.getElementsByTagName("label")[2].className = a
    document.getElementsByTagName("label")[3].className = a
}
async function deletecourse() {
    removeall()
    try {
        var progress = document.getElementById("cprogress")
        progress.style.visibility = "visible";
        var cno = document.getElementById("cdelete").value;
        if (!cno) {
            throw {
                message: "Please fill Course No.",
                error: new Error()
            };
        }
        var isexist = true;
        var subjectname = ""
        await db.collection("courseData").doc(cno.toString()).get().then((doc) => {
            if (!doc.exists) {
                isexist = false;
            }
            else {
                subjectname = doc.data()["Name"]
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        if (!isexist) {
            throw {
                message: "Course dosen't exist",
                error: new Error()
            };
        }
        if (confirm('Are you sure you want to delete ' + subjectname + "?")) {
            await db.collection("courseData").doc(cno.toString()).delete().then(() => {
                //console.log("Document successfully deleted!");
                updateschooldata()
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            retriveCourseData()
            throw {
                message: "Course deleted succussfully",
                error: new Error()
            };
        }
    }
    catch (err) {
        window.alert(err.message)
    }
    removeextra()
    progress.style.visibility = "hidden";
}
function removeextra() {
    document.getElementById("cedit").value = "";
    document.getElementById("cdelete").value = "";
    document.getElementsByTagName("label")[10].className = "";
    document.getElementsByTagName("label")[11].className = "";
}
async function updateschooldata() {
    var progress = document.getElementById("cprogress")
    progress.style.visibility = "visible";
    var SCET = [];
    var SEE = [];
    var SCE = [];
    var SMCEM = [];
    var SMCEC = [];
    await db.collection("courseData").where("SCET", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SCET.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SEE", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SEE.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SCE", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SCE.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SMCEM", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SMCEM.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SMCEC", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SMCEC.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("All", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SCET.push(doc.id.toString() + "~" + doc.data().Name)
                SEE.push(doc.id.toString() + "~" + doc.data().Name)
                SCE.push(doc.id.toString() + "~" + doc.data().Name)
                SMCEM.push(doc.id.toString() + "~" + doc.data().Name)
                SMCEC.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    //console.log(SCET, SEE, SCE, SMCEM, SMCEC)
    await db.collection("Schools").doc("SCET").set({ SCET })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SEE").set({ SEE })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SCE").set({ SCE })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SMCEM").set({ SMCEM })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SMCEC").set({ SMCEC })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    progress.style.visibility = "hidden";
}