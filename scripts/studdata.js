getdata()

var input = document.getElementById('exl');
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
async function getdata() {
    var mydoc;
    const myquery = await db.collection("studentData").orderBy("CGPA").limit(3)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                mydoc = doc;
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    //myquery = myquery.startAt(doc);
}