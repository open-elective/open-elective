
window.addEventListener('DOMContentLoaded', () => getdata(2));
var input = document.getElementById('exl');
var lastdoc = null;
var nextpg = document.getElementById('page-next');
var pgno = 1;
var firstdoc = null;


async function getdata(b) {
    var rows = document.getElementById("studdatat").rows.length;
    //page length
    var pglen = 30;

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
    else {
        const ref = await db.collection("studentData").orderBy("CGPA", "desc").startAt(firstdoc).limit(pglen);
        data = await ref.get();
        pgno = 1;
        document.getElementById("page").innerHTML = "Page " + pgno.toString();
    }
    data.docs.forEach(doc => {
        const d = doc.data();
        addStudentDataTable(doc.id, d.Name, d.CGPA, d.Branch);
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
            console.log(data)
            checkValidity(data)
        });
    }
    else {
        window.alert("Please Upload Excel File only. (.xlsx extenstion)")
    }
})
function downloadtemp() {
    window.location.href = "https://github.com/open-elective/open-elective.github.io/raw/main/template/template.xlsx"
}
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
            var branch = data[i][3].toString()
            if (!(branch == "SCET" || branch == "SEE" || branch == "SMCEM" || branch == "SMCEC" || branch == "SCE")) {
                throw {
                    message: "Invalid Branch at : row(" + (i + 1).toString() + ")  {" + data[i][0].toString() + ", " + data[i][1].toString() + ", " + data[i][2].toString() + ", " + data[i][3].toString() + "}",
                    error: new Error()
                };
            }
            console.log(data[i][2])
        }
        uploaddata(data);
    }
    catch (err) {
        window.alert(err.message);
        document.getElementById("exl").value = "";
    }
}
async function uploaddata(data) {
    var i;
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
        console.log("in loop");
        await db.collection("studentData").doc("0" + data[i][0].toString()).set({
            Name: data[i][1].toString(),
            CGPA: data[i][2],
            Branch: data[i][3].toString()
        })
            .then(() => {
                console.log("Added in Database");
            })
            .catch((error) => {
                console.error("Error adding Data in database: ", error);
            });
        var percent = (i * 100) / (len - 1)
        progress.style = "width:" + percent.toString() + "%";
    }
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
}

function addStudentDataTable(prn, name, cgpa, school) {
    var table = document.getElementById("studdatat");
    var row = table.insertRow(document.getElementById("studdatat").rows.length);
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
                    addStudentDataTable(doc.id, d.Name, d.CGPA, d.Branch);
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