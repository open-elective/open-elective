
window.addEventListener('DOMContentLoaded', () => getdata());
var input = document.getElementById('exl');
var lastdoc=null;


async function getdata() {
    const ref = await db.collection("studentData").ord.startAfter(0).limit(6);
    const data = await ref.get();
    data.docs.forEach(doc => {
        const data = doc.data();
        addStudentDataTable(doc.id,data.Name,data.CGPA,data.Branch);
    });
    lastdoc = data.docs[data.docs.length-1]
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
            if (data[i][0].toString().length != 10) {
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
        await db.collection("studentData").doc(data[i][0].toString()).set({
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
    var table = document.getElementById("courset");
    var row = table.insertRow(1);
    var prnt = row.insertCell(0);
    var namet = row.insertCell(1);
    var cgpat = row.insertCell(2);
    var schoolt = row.insertCell(3);
    prnt.innerHTML = prn;
    namet.innerHTML = name;
    cgpat.innerHTML = cgpa;
    schoolt.innerHTML = school;
}