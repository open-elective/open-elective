var lastdoc = null;
var nextpg = document.getElementById('page-next');
var pgno = 1;
var firstdoc = null;
var storedata = null;
window.addEventListener('DOMContentLoaded', () => getdata(2));
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

    for (j = 0; j < data.docs.length; j++) {
        const d = data.docs[j].data();
        var pref = [];
        await db.collection("studentprefs").doc(data.docs[j].id).get().then((doc) => {
            if (doc.exists) {
                pref = doc.data().mypref
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        var myprefstr = pref.join(', ');
        var myalloc = ""
        if (!(d.alloc == null || d.alloc == 0)) {
            myalloc = d.alloc
        }
        addStudentDataTable(data.docs[j].id, d.Name, d.CGPA, d.School, myprefstr, myalloc);
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
                            for (k = 2; k < rows; k++)
                                document.getElementById("studprefdatat").deleteRow(1);
                            addStudentDataTable(doc.id, d.Name, d.CGPA, d.School, preftemp, myalloc);
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
async function allocation() {
    resetstuddata(1);
    //window.alert("This may take time, please be patient")
    const progress = document.getElementsByClassName("progress")[0];
    const ref = await db.collection("studentData").orderBy("CGPA", "desc");
    storedata = await ref.get();
    const len = storedata.docs.length;
    for (l = 0; l < len; l++) {
        progress.style.visibility = "visible";
        var pref = [];
        //console.log(storedata.docs[l].id)
        await db.collection("studentprefs").doc(storedata.docs[l].id).get().then((doc) => {
            if (doc.exists) {
                pref = doc.data().mypref
                // console.log(pref)
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        var gotit = false;
        for (m = 0; m < pref.length; m++) {
            if (gotit) {
                break;
            }
            var myschool;
            var cdata
            await db.collection("courseData").doc(pref[m]).get().then((doc) => {
                if (doc.exists) {
                    cdata = doc.data();
                    //console.log(cdata)
                    myschool = (cdata.School == storedata.docs[l].data().School)
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });



            if (myschool) {
                if (cdata.Intfill < cdata.InternalCap) {

                    await db.collection("courseData").doc(pref[m]).update({
                        Intfill: cdata.Intfill + 1
                    })
                        .then(() => {
                            //console.log("Added in Database");
                        })
                        .catch((error) => {
                            console.error("Error adding Data in database: ", error);
                        });
                    await db.collection("studentData").doc(storedata.docs[l].id).update({
                        alloc: pref[m]
                    })
                        .then(() => {
                            //console.log("Added in Database");
                        })
                        .catch((error) => {
                            console.error("Error adding Data in database: ", error);
                        });
                }
                gotit = true
            }
            else {
                if (cdata.Extfill < cdata.ExternalCap) {
                    db.collection("courseData").doc(pref[m]).update({
                        Extfill: cdata.Extfill + 1
                    })
                        .then(() => {
                            //console.log("Added in Database");
                        })
                        .catch((error) => {
                            console.error("Error adding Data in database: ", error);
                        });
                    db.collection("studentData").doc(storedata.docs[l].id).update({
                        alloc: pref[m]
                    })
                        .then(() => {
                            //console.log("Added in Database");
                        })
                        .catch((error) => {
                            console.error("Error adding Data in database: ", error);
                        });
                }
                gotit = true
            }

        }
        var percent = (l * 100) / (len - 1)
        progress.style = "width:" + percent.toString() + "%";
    }
    progress.style.visibility = "hidden";
    getdata(2)
}
async function resetstuddata(b) {
    if (storedata != null) {
        for (n = 0; n < storedata.docs.length; n++) {
            await db.collection("studentData").doc(storedata.docs[n].id).update({
                alloc: 0
            })
                .then(() => {
                    //console.log("Added in Database");
                })
                .catch((error) => {
                    console.error("Error adding Data in database: ", error);
                });
        }
    }
    else {
        await db.collection("studentData").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("studentData").doc(doc.id).update({
                        alloc: 0
                    })
                        .then(() => {
                            //console.log("Added in Database");
                        })
                        .catch((error) => {
                            console.error("Error adding Data in database: ", error);
                        });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    await db.collection("courseData").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("courseData").doc(doc.id).update({
                    Extfill: 0,
                    Intfill: 0
                })
                    .then(() => {
                        //console.log("Added in Database");
                    })
                    .catch((error) => {
                        console.error("Error adding Data in database: ", error);
                    });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    if (b == 2) {
        getdata(2)
    }
}


