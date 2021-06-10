var input = document.getElementById('exl');
var lastdoc = null;
var nextpg = document.getElementById('page-next');
var pgno = 1;
var firstdoc = null;
window.addEventListener('DOMContentLoaded', () => getdata(2));
const c2 = document.getElementById('c2')
const c3 = document.getElementById('c3')
const c4 = document.getElementById('c4')
const c5 = document.getElementById('c5')
const c6 = document.getElementById('c6')
const myModal = document.querySelectorAll('.modal')
c2.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById("c3").checked = false;
        document.getElementById("c4").checked = false;
        document.getElementById("c5").checked = false;
        document.getElementById("c6").checked = false;
    }
})
c3.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById("c2").checked = false;
        document.getElementById("c4").checked = false;
        document.getElementById("c5").checked = false;
        document.getElementById("c6").checked = false;
    }
})
c4.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById("c2").checked = false;
        document.getElementById("c3").checked = false;
        document.getElementById("c5").checked = false;
        document.getElementById("c6").checked = false;
    }
})
c5.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById("c2").checked = false;
        document.getElementById("c3").checked = false;
        document.getElementById("c4").checked = false;
        document.getElementById("c6").checked = false;
    }
})
c6.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById("c2").checked = false;
        document.getElementById("c3").checked = false;
        document.getElementById("c4").checked = false;
        document.getElementById("c5").checked = false;
    }
})

async function getdata(b) {
    var rows = document.getElementById("studdatat").rows.length;
    //page length
    var pglen = 20;

    //delete all row
    for (i = 2; i < rows; i++)
        document.getElementById("studdatat").deleteRow(1);
    var data = 0;

    //get highest marking student
    await db.collection("studentData").orderBy("CGPA", "desc").limit(1).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            firstdoc = doc;
        });
    });

    //next page
    if (b == 1) {
        const ref = await db.collection("studentData").orderBy("CGPA", "desc").startAfter(lastdoc).limit(pglen);
        data = await ref.get();
        pgno++;
        document.getElementById("page").innerHTML = "Page " + pgno.toString();
    }
    //refresh page
    else {
        const ref = await db.collection("studentData").orderBy("CGPA", "desc").startAt(firstdoc).limit(pglen);
        data = await ref.get();
        pgno = 1;
        document.getElementById("page").innerHTML = "Page " + pgno.toString();
    }
    data.docs.forEach(doc => {
        const d = doc.data();
        addStudentDataTable(doc.id, d.Name, d.CGPA, d.School);
    });

    //note the last row data for paging
    lastdoc = data.docs[data.docs.length - 1]

    if (data.empty || data.docs.length < pglen) {
        nextpg.className = "waves-effect waves-light btn blue darken-2 disabled";
    }
    else {
        nextpg.className = "waves-effect waves-light btn blue darken-2";
    }
}

input.addEventListener('change', function () {
    if (document.getElementById('exl').value.endsWith(".xlsx")) {
        readXlsxFile(input.files[0]).then(function (data) {
            checkValidity(data)
        });
    }
    else {
        window.alert("Please Upload Excel File only. (.xlsx extenstion)")
    }
})

function checkValidity(data) {
    try {
        var i;
        for (i = 1; i < data.length; i++) {
            if (data[i][0].toString().length != 9) {
                throw {
                    message: "Invalid PRN at : row(" + (i + 1).toString() + ")  {" + data[i][0].toString() + ", " + data[i][1].toString() + ", " + data[i][2].toString() + ", " + data[i][3].toString() + "}",
                    error: new Error()
                };
            }
            if (data[i][2] > 10 || data[i][2] < 0) {
                throw {
                    message: "Invalid CGPA at : row(" + (i + 1).toString() + ")  {" + data[i][0].toString() + ", " + data[i][1].toString() + ", " + data[i][2].toString() + ", " + data[i][3].toString() + "}",
                    error: new Error()
                };
            }
            var School = data[i][3].toString()
            if (!(School == "SCET" || School == "SEE" || School == "SMCEM" || School == "SMCEC" || School == "SCE")) {
                throw {
                    message: "Invalid School at : row(" + (i + 1).toString() + ")  {" + data[i][0].toString() + ", " + data[i][1].toString() + ", " + data[i][2].toString() + ", " + data[i][3].toString() + "}",
                    error: new Error()
                };
            }
        }
        uploaddata(data);
    }
    catch (err) {
        window.alert(err.message);
        document.getElementById("exl").value = "";
    }
}
async function uploaddata(data) {

    if (confirm("You are about to upload the data on the database, this may overwrite the previous data. Do you still want to proceed?")) {
        window.alert("Please be patient while we upload the data to the database")
        var i;
        var uploadbtn = document.getElementById("exl-l");
        uploadbtn.className = "btn waves-effect waves-light blue darken-2 disabled"
        var progress = document.getElementsByClassName("determinate")[0];
        document.getElementsByClassName("progress")[0].style.visibility = "visible";
        await db.collection("Misc").doc("State").get().then((doc) => {
            if (doc.exists) {
                if (doc.data()["Allow"] == 3) {
                    window.alert("Result is already Published, This upload won't affect allocation now");
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        var len = data.length;
        for (i = 1; i < len; i++) {
            await db.collection("studentData").doc("0" + data[i][0].toString()).set({
                Name: data[i][1].toString(),
                CGPA: data[i][2],
                School: data[i][3].toString()
            })
                .then(() => {

                })
                .catch((error) => {
                    console.error("Error adding Data in database: ", error);
                });
            var percent = (i * 100) / (len - 1)
            progress.style = "width:" + percent.toString() + "%";
        }
        document.getElementsByClassName("progress")[0].style.visibility = "hidden";
        uploadbtn.className = "btn waves-effect waves-light blue darken-2"
        getdata(2)

    }

}

function addStudentDataTable(prn, name, cgpa, school) {
    var table = document.getElementById("studdatat");
    var row = table.insertRow(document.getElementById("studdatat").rows.length - 1);
    var prnt = row.insertCell(0);
    var namet = row.insertCell(1);
    var cgpat = row.insertCell(2);
    var schoolt = row.insertCell(3);
    prnt.innerHTML = prn;
    namet.innerHTML = name;
    cgpat.innerHTML = cgpa;
    schoolt.innerHTML = school;
}
function searchtest() {

    const res = document.getElementById("search").value
    if (res.toString().length == 10) {
        db.collection("studentData").doc(res.toString())
            .get().then((doc) => {
                if (doc.exists) {
                    var rows = document.getElementById("studdatat").rows.length;
                    for (i = 2; i < rows; i++)
                        document.getElementById("studdatat").deleteRow(1);
                    const d = doc.data();
                    addStudentDataTable(doc.id, d.Name, d.CGPA, d.School);
                } else {
                    window.alert("Student not found with that PRN")
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
    else {
        window.alert("Invalid PRN")
        getdata(2)
    }

}
function searchforedit() {

    const res = document.getElementById("editprn").value
    document.getElementById("editprn").disabled = true
    if (res.toString().length == 10) {
        db.collection("studentData").doc(res.toString())
            .get().then((doc) => {
                if (doc.exists) {
                    const d = doc.data();
                    document.getElementById("editname").value = d.Name;
                    document.getElementById("editcgpa").value = d.CGPA;
                    var schooltemp = doc.data().School;
                    if (schooltemp == "SCET") {
                        document.getElementById("c2").checked = true
                    }
                    else if (schooltemp == "SEE") {
                        document.getElementById("c3").checked = true
                    }
                    else if (schooltemp == "SCE") {
                        document.getElementById("c6").checked = true
                    }
                    else if (schooltemp == "SMCEC") {
                        document.getElementById("c5").checked = true
                    }
                    else if (schooltemp == "SMCEM") {
                        document.getElementById("c4").checked = true
                    }
                    document.getElementsByTagName("label")[3].className = "active"
                    document.getElementsByTagName("label")[4].className = "active"
                } else {
                    window.alert("Student not found with that PRN")
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
    else {
        window.alert("Invalid PRN")
    }
}
async function editstud(e) {
    try {
        var editname = document.getElementById("editname").value;
        var editprn = document.getElementById("editprn").value;
        var editcgpa = document.getElementById("editcgpa").value;
        var c2 = document.getElementById("c2");
        var c3 = document.getElementById("c3");
        var c4 = document.getElementById("c4");
        var c5 = document.getElementById("c5");
        var c6 = document.getElementById("c6");
        var school = ""

        if (c2.checked)
            school = "SCET"
        else if (c3.checked)
            school = "SEE"
        else if (c4.checked)
            school = "SMCEM"
        else if (c5.checked)
            school = "SMCEC"
        else if (c6.checked)
            school = "SCE"

        if (!editname || !editprn || !editcgpa || school == "") {
            throw {
                message: "Please fill All details",
                error: new Error()
            };
        }
        var edit = true;
        await db.collection("Misc").doc("State").get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.Allow == 3) {
                    if (!confirm("Result is already Published, This won't affect allocation now. Do you still want to continue?")) {
                        edit = false;
                    }
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        var exist = false;
        await db.collection("studentData").doc(editprn.toString()).get().then((doc) => {
            if (doc.exists) {
                if (!confirm('This PRN already exist. Are you sure you want to edit the student data?')) {
                    edit = false;
                }
                else {
                    exist = true;
                    console.log(exist)
                }
            }
            else {
                if (!confirm("This PRN Doesn't exist. Are you sure you want to add the student data?")) {
                    edit = false;
                    exist = false;
                }
                else {
                    exist = false;
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
        if (exist) {
            await db.collection("studentData").doc(editprn.toString()).update({
                Name: editname.toString(),
                CGPA: parseFloat(editcgpa.toString()),
                School: school,
            })
                .then(() => {
                })
                .catch((error) => {
                    console.error("Error adding Data in database: ", error);
                });
        }
        else {
            await db.collection("studentData").doc(editprn.toString()).set({
                Name: editname.toString(),
                CGPA: parseFloat(editcgpa.toString()),
                School: school,
            })
                .then(() => {
                })
                .catch((error) => {
                    console.error("Error adding Data in database: ", error);
                });
        }
        dismiss()
        if (e != null) {
            e.preventDefault()
            M.Modal.getInstance(myModal[0]).close()
        }

    }
    catch (err) {
        window.alert(err.message)
    }
}
function dismiss(e) {
    document.getElementById("editprn").disabled = false
    document.getElementById("editprn").value = ""
    document.getElementById("editname").value = ""
    document.getElementById("editcgpa").value = ""
    document.getElementsByTagName("label")[2].className = ""
    document.getElementsByTagName("label")[3].className = ""
    document.getElementsByTagName("label")[4].className = ""
    document.getElementById("c2").checked = false;
    document.getElementById("c3").checked = false;
    document.getElementById("c4").checked = false;
    document.getElementById("c5").checked = false;
    document.getElementById("c6").checked = false;
    if (e != null) {
        e.preventDefault()
        M.Modal.getInstance(myModal[0]).close()
    }
}