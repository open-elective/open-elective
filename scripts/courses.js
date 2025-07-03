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
                    if (data.ComputerEngineering) {
                        temp = temp + "ComputerEngineering" + ", "
                    }
                    if (data.SoftwareEngineering) {
                        temp = temp + "SoftwareEngineering" + ", "
                    }
                    if (data.CSEAIML) {
                        temp = temp + "CSEAIML" + ", "
                    }
                    if (data.CSEDS) {
                        temp = temp + "CSEDS" + ", "
                    }
                    if (data.IT) {
                        temp = temp + "IT" + ", "
                    }
                    if (data.ElectronicandTelecomunicationEngineering) {
                        temp = temp + "ElectronicandTelecomunicationEngineering" + ", "
                    }
                    if (data.CivilEngineering) {
                        temp = temp + "CivilEngineering" + ", "
                    }
                    if (data.MechanicalEngineering) {
                        temp = temp + "MechanicalEngineering" + ", "
                    }
                    if (data.EntrepreneurshipDevelopment) {
                        temp = temp + "EntrepreneurshipDevelopment" + ", "
                    }
                    if (data.SchoolOfDesign) {
                        temp = temp + "SchoolOfDesign" + ", "
                    }
                    if (data.ChemicalEngineering) {
                        temp = temp + "ChemicalEngineering" + ", "
                    }
                    if (data.ACSCBusinessManagement) {
                        temp = temp + "ACSCBusinessManagement" + ", "
                    }
                    if (data.ElectronicsEngineering) {
                        temp = temp + "ElectronicsEngineering" + ", "
                    }
                    if (data.SHES) {
                        temp = temp + "SHES" + ", "
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
const all = document.getElementById('c0')
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
    document.getElementById("c0").disabled = ""
    document.getElementById("c0").checked = false;


    var schooldd = document.getElementById("schooldd");
    var dd = schooldd.selectedIndex || -1;
    document.getElementById("c" + dd).checked = true;
    // document.getElementById("c" + dd).disabled = "disabled"

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
        var c0 = document.getElementById("c0");
        var c1 = document.getElementById("c1");
        var c2 = document.getElementById("c2");
        var c3 = document.getElementById("c3");
        var c4 = document.getElementById("c4");
        var c5 = document.getElementById("c5");
        var c6 = document.getElementById("c6");
        var c7 = document.getElementById("c7");
        var c8 = document.getElementById("c8");
        var c9 = document.getElementById("c9");
        var c10 = document.getElementById("c10");
        var c11 = document.getElementById("c11");
        var c12 = document.getElementById("c12");
        var c13 = document.getElementById("c13");
        var c14 = document.getElementById("c14");
        var dd = schooldd.selectedIndex;
        var school = ""
        //skip if All check box is selected
        var skip = false;
        if (c1.checked && c2.checked && c3.checked && c4.checked && c5.checked && c6.checked && c7.checked && c8.checked && c9.checked && c10.checked && c11.checked && c12.checked && c13.checked && c14.checked) {
            skip = true;
        }

        switch (dd) {
            case 1:
                school = "Computer engineering";
                break;
            case 2:
                school = "Software engineering";
                break;
            case 3:
                school = "CSE AIML";
                break;
            case 4:
                school = "CSE DS";
                break;
            case 5:
                school = "IT";
                break;
            case 6:
                school = "Electronic and Telecomunication engineering";
                break;
            case 7:
                school = "Civil engineering";
                break;
            case 8:
                school = "Mechancal Engineering";
                break;
            case 9:
                school = "Entrepreneurship Development";
                break;
            case 10:
                school = "School of design";
                break;
            case 11:
                school = "Chemical engineering";
                break;
            case 12:
                school = "ACSC Business management";
                break;
            case 13:
                school = "Electronics Engineering";
                break;
            case 14:
                school = "SHES";
                break;
            default:
                school = "";
        }

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
            All: c0.checked || skip,
            ComputerEngineering: c1.checked && !skip,
            SoftwareEngineering: c2.checked && !skip,
            CSEAIML: c3.checked && !skip,
            CSEDS: c4.checked && !skip,
            IT: c5.checked && !skip,
            ElectronicandTelecomunicationEngineering: c6.checked && !skip,
            CivilEngineering: c7.checked && !skip,
            MechanicalEngineering: c8.checked && !skip,
            EntrepreneurshipDevelopment: c9.checked && !skip,
            SchoolOfDesign: c10.checked && !skip,
            ChemicalEngineering: c11.checked && !skip,
            ACSCBusinessManagement: c12.checked && !skip,
            ElectronicsEngineering: c13.checked && !skip,
            SHES: c14.checked && !skip,
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
    document.getElementById("c0").disabled = "";
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
    document.getElementById("c0").checked = false;
    removeallcheck()
}
function removeallcheck() {
    document.getElementById("c1").checked = false;
    document.getElementById("c2").checked = false;
    document.getElementById("c3").checked = false;
    document.getElementById("c4").checked = false;
    document.getElementById("c5").checked = false;
    document.getElementById("c6").checked = false;
    document.getElementById("c7").checked = false;
    document.getElementById("c8").checked = false;
    document.getElementById("c9").checked = false;
    document.getElementById("c10").checked = false;
    document.getElementById("c11").checked = false;
    document.getElementById("c12").checked = false;
    document.getElementById("c13").checked = false;
    document.getElementById("c14").checked = false;
}
function blockall(b) {
    document.getElementById("c1").disabled = b;
    document.getElementById("c2").disabled = b;
    document.getElementById("c3").disabled = b;
    document.getElementById("c4").disabled = b;
    document.getElementById("c5").disabled = b;
    document.getElementById("c6").disabled = b;
    document.getElementById("c7").disabled = b;
    document.getElementById("c8").disabled = b;
    document.getElementById("c9").disabled = b;
    document.getElementById("c10").disabled = b;
    document.getElementById("c11").disabled = b;
    document.getElementById("c12").disabled = b;
    document.getElementById("c13").disabled = b;
    document.getElementById("c14").disabled = b;
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

                switch (schooltemp) {
                    case "Computer engineering":
                        document.getElementById("c1").disabled = "disabled"
                        s = 1
                        break;
                    case "Software engineering":
                        document.getElementById("c2").disabled = "disabled"
                        s = 2
                        break;
                    case "CSE AIML":
                        document.getElementById("c3").disabled = "disabled"
                        s = 3
                        break;
                    case "CSE DS":
                        document.getElementById("c4").disabled = "disabled"
                        s = 4
                        break;
                    case "IT":
                        document.getElementById("c5").disabled = "disabled"
                        s = 5
                        break;
                    case "Electronic and Telecomunication engineering":
                        document.getElementById("c6").disabled = "disabled"
                        s = 6
                        break;
                    case "Civil engineering":
                        document.getElementById("c7").disabled = "disabled"
                        s = 7
                        break;
                    case "Mechancal Engineering":
                        document.getElementById("c8").disabled = "disabled"
                        s = 8
                        break;
                    case "Entrepreneurship Development":
                        document.getElementById("c9").disabled = "disabled"
                        s = 9
                        break;
                    case "School of design":
                        document.getElementById("c10").disabled = "disabled"
                        s = 10
                        break;
                    case "Chemical engineering":
                        document.getElementById("c11").disabled = "disabled"
                        s = 11
                        break;
                    case "ACSC Business management":
                        document.getElementById("c12").disabled = "disabled"
                        s = 12
                        break;
                    case "Electronics Engineering":
                        document.getElementById("c13").disabled = "disabled"
                        s = 13
                        break;
                    case "SHES":
                        document.getElementById("c14").disabled = "disabled"
                        s = 14
                        break;
                    default:
                        document.getElementById("c0").disabled = "disabled"
                        s = 0;
                }




                document.getElementById("cname").value = data.Name;
                document.getElementById("cno").value = doc.id;
                document.getElementById("cincapa").value = data.InternalCap;
                document.getElementById("cextcapa").value = data.ExternalCap;
                document.getElementById("schooldd").M_FormSelect.input.value = schooltemp;
                document.getElementById("schooldd").selectedIndex = s;
                document.getElementById("c0").checked = data.All;
                document.getElementById("c1").checked = data.ComputerEngineering;
                document.getElementById("c2").checked = data.SoftwareEngineering;
                document.getElementById("c3").checked = data.CSEAIML;
                document.getElementById("c4").checked = data.CSEDS;
                document.getElementById("c5").checked = data.IT;
                document.getElementById("c6").checked = data.ElectronicandTelecomunicationEngineering;
                document.getElementById("c7").checked = data.CivilEngineering;
                document.getElementById("c8").checked = data.MechanicalEngineering;
                document.getElementById("c9").checked = data.EntrepreneurshipDevelopment;
                document.getElementById("c10").checked = data.SchoolOfDesign;
                document.getElementById("c11").checked = data.ChemicalEngineering;
                document.getElementById("c12").checked = data.ACSCBusinessManagement;
                document.getElementById("c13").checked = data.ElectronicsEngineering;
                document.getElementById("c14").checked = data.SHES;


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
    var ComputerEngineering = [];
    var SoftwareEngineering = [];
    var CSEAIML = [];
    var CSEDS = [];
    var IT = [];
    var ElectronicandTelecomunicationEngineering = [];
    var CivilEngineering = [];
    var MechanicalEngineering = [];
    var EntrepreneurshipDevelopment = [];
    var SchoolOfDesign = [];
    var ChemicalEngineering = [];
    var ACSCBusinessManagement = [];
    var ElectronicsEngineering = [];
    var SHES = [];


    await db.collection("courseData").where("ComputerEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ComputerEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SoftwareEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SoftwareEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("CSEAIML", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                CSEAIML.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("CSEDS", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                CSEDS.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("IT", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                IT.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("ElectronicandTelecomunicationEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ElectronicandTelecomunicationEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("CivilEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                CivilEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("MechanicalEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                MechanicalEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("EntrepreneurshipDevelopment", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                EntrepreneurshipDevelopment.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SchoolOfDesign", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SchoolOfDesign.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("ChemicalEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ChemicalEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("ACSCBusinessManagement", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ACSCBusinessManagement.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("ElectronicsEngineering", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ElectronicsEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    await db.collection("courseData").where("SHES", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                SHES.push(doc.id.toString() + "~" + doc.data().Name)
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
                ComputerEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                SoftwareEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                CSEAIML.push(doc.id.toString() + "~" + doc.data().Name)
                CSEDS.push(doc.id.toString() + "~" + doc.data().Name)
                IT.push(doc.id.toString() + "~" + doc.data().Name)
                ElectronicandTelecomunicationEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                CivilEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                MechanicalEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                EntrepreneurshipDevelopment.push(doc.id.toString() + "~" + doc.data().Name)
                SchoolOfDesign.push(doc.id.toString() + "~" + doc.data().Name)
                ChemicalEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                ACSCBusinessManagement.push(doc.id.toString() + "~" + doc.data().Name)
                ElectronicsEngineering.push(doc.id.toString() + "~" + doc.data().Name)
                SHES.push(doc.id.toString() + "~" + doc.data().Name)

                //console.log(doc.id, " => ", doc.data().Name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    await db.collection("Schools").doc("ComputerEngineering").set({ ComputerEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SoftwareEngineering").set({ SoftwareEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("CSEAIML").set({ CSEAIML })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("CSEDS").set({ CSEDS })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("IT").set({ IT })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("ElectronicandTelecomunicationEngineering").set({ ElectronicandTelecomunicationEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("CivilEngineering").set({ CivilEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("MechanicalEngineering").set({ MechanicalEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("EntrepreneurshipDevelopment").set({ EntrepreneurshipDevelopment })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SchoolOfDesign").set({ SchoolOfDesign })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("ChemicalEngineering").set({ ChemicalEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("ACSCBusinessManagement").set({ ACSCBusinessManagement })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("ElectronicsEngineering").set({ ElectronicsEngineering })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    await db.collection("Schools").doc("SHES").set({ SHES })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


    progress.style.visibility = "hidden";
}
