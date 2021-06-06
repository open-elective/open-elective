window.addEventListener('DOMContentLoaded', () => getdata(2));
var lastdoc = null;
var nextpg = document.getElementById('page-next');
var pgno = 1;
var firstdoc = null;
async function getdata(b) {
    var rows = document.getElementById("studprefdatat").rows.length;
    //page length
    var pglen = 20;

    //delete all row
    for (i = 2; i < rows; i++)
        document.getElementById("studprefdatat").deleteRow(1);
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

    for (i = 0; i < data.docs.length; i++) {
        const d = data.docs[i].data();
        var pref = [];
        await db.collection("studentprefs").doc(data.docs[i].id).get().then((doc) => {
            if (doc.exists) {
                pref = doc.data().mypref
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        var myprefstr = pref.join(', ');
        var myalloc = ""
        if (d.alloc != null) {
            myalloc = d.alloc
        }
        addStudentDataTable(data.docs[i].id, d.Name, d.CGPA, d.School, myprefstr, myalloc);
    }
    // data.docs.forEach(doc => {
    //     const d = doc.data();
    //     addStudentDataTable(doc.id, d.Name, d.CGPA, d.School,"");
    // });
    //note the last row data for paging
    lastdoc = data.docs[data.docs.length - 1]

    if (data.empty || data.docs.length < pglen) {
        nextpg.className = "waves-effect waves-light btn blue darken-2 disabled";
    }
    else {
        nextpg.className = "waves-effect waves-light btn blue darken-2";
    }
}

function addStudentDataTable(prn, name, cgpa, school, pref, allo) {
    var table = document.getElementById("studprefdatat");
    var row = table.insertRow(document.getElementById("studprefdatat").rows.length - 1);
    var prnt = row.insertCell(0);
    var namet = row.insertCell(1);
    var cgpat = row.insertCell(2);
    var schoolt = row.insertCell(3);
    var preft = row.insertCell(4);
    var allot = row.insertCell(5);
    prnt.innerHTML = prn;
    namet.innerHTML = name;
    cgpat.innerHTML = cgpa;
    schoolt.innerHTML = school;
    preft.innerHTML = pref;
    allot.innerHTML = allo;
}

function searchtest() {
    const res = document.getElementById("search").value
    if (res.toString().length == 10) {
        db.collection("studentData").doc(res.toString())
            .get().then((doc) => {
                if (doc.exists) {
                    var preftemp = ""
                    const d = doc.data();
                    var myalloc = ""
                    if (d.alloc != null) {
                        myalloc = d.alloc
                    }
                    db.collection("studentprefs").doc(res.toString())
                        .get().then((doc) => {
                            if (doc.exists) {
                                preftemp = doc.data().mypref.join(', ');
                            }
                            var rows = document.getElementById("studprefdatat").rows.length;
                            for (i = 2; i < rows; i++)
                                document.getElementById("studprefdatat").deleteRow(1);
                            addStudentDataTable(doc.id, d.Name, d.CGPA, d.School, preftemp,myalloc);
                        }).catch((error) => {
                            console.log("Error getting document:", error);
                        });
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