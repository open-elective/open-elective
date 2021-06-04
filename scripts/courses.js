retriveCourseData()
function retriveCourseData()
{
    firebase.firestore().collection("courseData")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var temp =""
            console.log(doc.id, " => ", doc.data());
            if(doc.data()["All"])
            {
                temp="All"
            }
            else 
            {
                if(doc.data()["SCET"])
                {
                    temp = temp + "SCET" +", "
                }
                if(doc.data()["SEE"])
                {
                    temp = temp + "SEE" +", "
                }
                if(doc.data()["SMCEM"])
                {
                    temp = temp + "SMCEM" +", "
                }
                if(doc.data()["SMCEC"])
                {
                    temp = temp + "SMCEC" +", "
                }
                if(doc.data()["SCE"])
                {
                    temp = temp + "SCE" +", "
                }
            }
            addCourseTable(doc.id,doc.data()["Name"],doc.data()["InternalCap"],doc.data()["ExternalCap"],doc.data()["School"],temp)
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
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
function ddchanged()
{
    if(document.getElementById("c1").checked)
    return;
    blockall("")
    removeallcheck()
    var schooldd = document.getElementById("schooldd");
    var dd = schooldd.selectedIndex;
    if (dd == 1)
    {
        document.getElementById("c2").checked = true;
        document.getElementById("c2").disabled = "disabled"
    }
    else if (dd == 2)
    {
        document.getElementById("c3").checked = true;
        document.getElementById("c3").disabled = "disabled"
    }
    else if (dd == 3)
    {
        document.getElementById("c4").checked = true;
        document.getElementById("c4").disabled = "disabled"
    }
    else if (dd == 4)
    {
        document.getElementById("c5").checked = true;
        document.getElementById("c5").disabled = "disabled"
    }
    else if (dd == 5)
    {
        document.getElementById("c6").disabled = "disabled"
        document.getElementById("c6").checked = true;
    }
}
async function addcourse() {
    try {
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
                
        if (!cname || !cno || !cincapa || !cextcapa || !schooldd) {
            throw {
                message: "Please fill All details",
                error: new Error()
            };
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
    }
    catch (err) {
        window.alert(err.message)
    }
    removeall()
}
function removeall() {
    blockall("")
    document.getElementById("cname").value = "";
    document.getElementById("cno").value = "";
    document.getElementById("cincapa").value = "";
    document.getElementById("cextcapa").value = "";
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
function blockall(b){
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