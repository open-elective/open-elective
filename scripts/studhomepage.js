window.addEventListener('DOMContentLoaded', () => initiate());
var optionsfromdb;
async function checkState() {
    db.collection("Misc").doc("State").get().then((doc) => {
        const data = doc.data();
        if (data.Allow == 0) {
            //closed portal
            if (window.location.href.slice(-16) != "studlanding.html") {
                window.location.href = "/student/studlanding.html";
            }
        }
        else if (data.Allow == 1) {
            //opened portal
            assignDropdownOp()
        }
        else if (data.Allow == 2) {
            //allocation phase


            //window.location.href="send to result will be published soon"
        }
        else if (data.Allow == 3) {
            console.log("result published phase")
            //result published phase

            //window.location.href="send to show result page"
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
function initiate() {
    db.collection("Misc").doc("State")
        .onSnapshot((doc) => {
            checkState();
        });
}
async function assignDropdownOp() {
    var dd = document.getElementById("schooldd");
    var prn = await firebase.auth().currentUser.photoURL;
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
    document.getElementById("dispPRN").innerHTML += " " + prn;
    document.getElementById("dispname").innerHTML += " " + name;
    document.getElementById("dispcgpa").innerHTML += " " + CGPA;
    document.getElementById("dispschool").innerHTML += " " + school;
    var options = []
    await db.collection("Schools").doc(school).get().then((doc) => {
        options = doc.data()[school]
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    optionsfromdb = options;
    for (var option in options) {
        var pair = options[option].split("~");
        var newOption = document.createElement("option");
        newOption.value = pair[0];
        newOption.innerHTML = pair[1];
        dd.options.add(newOption);
    }
}
function selectpref() {
    var dd = document.getElementById("schooldd");
    console.log(dd.value)
    var value = dd.options[dd.selectedIndex].value;// get selected option value
    var text = dd.options[dd.selectedIndex].text;
    dd.remove(dd.selectedIndex);
    addCourseTable(text)
}
function addCourseTable(cname) {
    var table = document.getElementById("preftable");
    var row = table.insertRow(document.getElementById("preftable").rows.length - 1);
    var cnot = row.insertCell(0);
    var cnamet = row.insertCell(1);
    cnot.innerHTML = document.getElementById("preftable").rows.length - 2;
    cnamet.innerHTML = cname;
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
}