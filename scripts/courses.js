function addcourse() {
    var cname = document.getElementById("cname").value;
    var cno = document.getElementById("cno").value;
    var cincapa = document.getElementById("cincapa").value;
    var cextcapa = document.getElementById("cextcapa").value;
    var schooldd = document.getElementById("schooldd").value;
    var c1 = document.getElementById("c1");
    var c2 = document.getElementById("c2");
    var c3 = document.getElementById("c3");
    var c4 = document.getElementById("c4");
    var c5 = document.getElementById("c5");
    var c6 = document.getElementById("c6");
    if (!cname || !cno || !cincapa || !cextcapa || !schooldd) {
        window.alert("Please fill All details")
    }
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.exists) {
            if (doc.data()["Allow"] == 3) {
                window.alert("Result is already Published, Adding course won't affect allocation now");
            }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    var dd = schooldd.selectedIndex;
    var school = ""
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

    await firebase.firestore().collection("courseData").doc(cno.toString()).set({
        Name: cname.toString(),
        InternalCap: cincapa.toString(),
        ExternalCap: cextcapa.toString(),
        School: school,
        All: c1.checked,
        SCET: c2.checked,
        SEE: c3.checked,
        SMCEM: c4.checked,
        SMCEC: c5.checked,
        SCE: c6.checked
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