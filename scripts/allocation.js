var lastdoc = null;
var nextpg = document.getElementById('page-next');
var pgno = 1;
var firstdoc = null;
var storedata = null;
var progress = document.getElementsByClassName("determinate")[0];
var storedatasd = null;
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
    document.getElementsByClassName("progress")[0].style.visibility = "hidden";
    progress.style = "width:0%";
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
    if (res.toString().length > 9) {
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
    //resetstuddata(1);
    //window.alert("This may take time, please be patient")
    if (confirm("You are about to do the allocations, Are you sure you want to proceed? ")) {
        window.alert("Please be patient while we do the allocations. You can check the progress at the bottom of the page")
        document.getElementsByClassName("progress")[0].style.visibility = "visible";

        const timepref = await db.collection("studentprefs");
        timedata = await timepref.get();

        for (t = 0; t < timedata.docs.length; t++) {
            if (timedata.docs[t].data().Time != null) {
                await db.collection("studentData").doc(timedata.docs[t].id).update({
                    Time: timedata.docs[t].data().Time
                })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
            else {
                await db.collection("studentData").doc(timedata.docs[t].id).update({
                    Time: 1777777777777
                })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }

        }
        const ref = await db.collection("studentData").orderBy("CGPA", "desc").orderBy("Time");
        storedata = await ref.get();
        const len = storedata.docs.length;
        for (l = 0; l < len; l++) {
            if ((storedata.docs[l].data().alloc == null || storedata.docs[l].data().alloc == 0)) {
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
                                alloc: parseInt(pref[m])
                            })
                                .then(() => {
                                    //console.log("Added in Database");
                                })
                                .catch((error) => {
                                    console.error("Error adding Data in database: ", error);
                                });
                            gotit = true
                        }

                    }
                    else {
                        if (cdata.Extfill < cdata.ExternalCap) {
                            await db.collection("courseData").doc(pref[m]).update({
                                Extfill: cdata.Extfill + 1
                            })
                                .then(() => {
                                    //console.log("Added in Database");
                                })
                                .catch((error) => {
                                    console.error("Error adding Data in database: ", error);
                                });
                            await db.collection("studentData").doc(storedata.docs[l].id).update({
                                alloc: parseInt(pref[m])
                            })
                                .then(() => {
                                    //console.log("Added in Database");
                                })
                                .catch((error) => {
                                    console.error("Error adding Data in database: ", error);
                                });
                            gotit = true
                        }
                    }

                }
            }
            var percent = (l * 100) / (len - 1)
            progress.style = "width:" + percent.toString() + "%";
            console.log("Index", l, percent)
        }
        console.log("triggered")
        getdata(2)
    }
}
async function resetstuddata() {
    if (confirm("You are about to rest the allocations, This will also reset late submission. Are you sure you want to proceed? ")) {
        window.alert("Please be patient while we reset the data. You can check the progress at the bottom of the page")
        document.getElementsByClassName("progress")[0].style.visibility = "visible";
        if (storedata != null) {
            const len = storedata.docs.length
            for (n = 0; n < len; n++) {
                await db.collection("studentData").doc(storedata.docs[n].id).update({
                    alloc: 0
                })
                    .then(() => {
                        //console.log("Added in Database");
                    })
                    .catch((error) => {
                        console.error("Error adding Data in database: ", error);
                    });
                var percent = (n * 100) / (len - 1)
                progress.style = "width:" + percent.toString() + "%";
            }
        }
        else {

            const ref = await db.collection("studentData").orderBy("CGPA", "desc");
            storedata = await ref.get();
            resetstuddata()
            return;
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
        getdata(2)
    }
}
async function downloadcoursewisedata() {

    //Date and time intiate
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    //course wise
    var wb = XLSX.utils.book_new();
    //woorkbook initiate
    wb.Props = {
        Title: "Course Wise data",
        Subject: "Data",
        Author: "Open-Elective-Devlopers",
        CreatedDate: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    };


    //Data fetching
    if (storedatasd == null) {
        const ref1 = await db.collection("studentData").orderBy("CGPA", "desc");
        storedatasd = await ref1.get();
    }

    const ref2 = await db.collection("courseData");
    const courseData = await ref2.get();

    //2d array implementation
    var coursewithname = new Array();
    for (i = 0; i < courseData.docs.length; i++) {
        coursewithname.push([courseData.docs[i].id, courseData.docs[i].data().Name]);
    }


    for (j = 0; j < coursewithname.length; j++) {
        var ws_data = [];
        ws_data.push(["PRN", "Name", "CGPA", "School", "Allocation"]);
        for (i = 0; i < storedatasd.docs.length; i++) {
            if (storedatasd.docs[i].data().alloc == coursewithname[j][0]) {
                ws_data.push([storedatasd.docs[i].id, storedatasd.docs[i].data().Name, storedatasd.docs[i].data().CGPA, storedatasd.docs[i].data().School, coursewithname[j][1]]);
            }
        }
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Create sheet name with proper truncation to 30 characters max
        var sheetName = coursewithname[j][1] + "-" + coursewithname[j][0];
        if (sheetName.length > 30) {
            var courseNamePart = coursewithname[j][1];
            var courseIdPart = coursewithname[j][0];
            var separator = "-";
            var availableLength = 30 - separator.length - courseIdPart.length;
            
            if (availableLength > 0) {
                var truncatedCourseName = courseNamePart.length > availableLength ? 
                    courseNamePart.slice(0, Math.floor(availableLength/2)) + "..." + courseNamePart.slice(-Math.floor((availableLength-3)/2)) :
                    courseNamePart;
                sheetName = truncatedCourseName + separator + courseIdPart;
            } else {
                // If course ID is too long, truncate it too
                sheetName = courseNamePart.slice(0, 12) + "..." + separator + courseIdPart.slice(0, 12);
            }
        }
        
        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = ws;
    }

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Course Wise Allocation Data' + dateTime + '.xlsx');




}

async function downloadSchoolwisedata() {

    //Date and time intiate
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    //School wise
    var wb = XLSX.utils.book_new();
    //woorkbook initiate
    wb.Props = {
        Title: "School Wise data",
        Subject: "Data",
        Author: "Open-Elective-Devlopers",
        CreatedDate: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    };


    //Data fetching
    if (storedatasd == null) {
        const ref1 = await db.collection("studentData").orderBy("CGPA", "desc");
        storedatasd = await ref1.get();
    }

    const ref3 = await db.collection("Schools");
    const schoolData = await ref3.get();

    const ref2 = await db.collection("courseData");
    const courseData = await ref2.get();

    //2d array implementation
    var schoolwithname = new Array();
    for (i = 0; i < schoolData.docs.length; i++) {
        schoolwithname.push(schoolData.docs[i].id);
    }
    //dictionary implementation
    var coursewithname = {};
    for (i = 0; i < courseData.docs.length; i++) {
        coursewithname[courseData.docs[i].id] = courseData.docs[i].data().Name;
    }


    for (j = 0; j < schoolwithname.length; j++) {
        var ws_data = [];
        ws_data.push(["PRN", "Name", "CGPA", "School", "Allocation"]);
        for (i = 0; i < storedatasd.docs.length; i++) {
            if (storedatasd.docs[i].data().School == schoolwithname[j]) {
                ws_data.push([storedatasd.docs[i].id, storedatasd.docs[i].data().Name, storedatasd.docs[i].data().CGPA, storedatasd.docs[i].data().School, coursewithname[storedatasd.docs[i].data().alloc]]);
            }
        }
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Create sheet name with proper truncation to 30 characters max
        var sheetName = schoolwithname[j];
        if (sheetName.length > 30) {
            // Truncate in the middle for school names longer than 30 characters
            var halfLength = Math.floor((30 - 3) / 2); // 3 for "..."
            sheetName = schoolwithname[j].slice(0, halfLength) + "..." + schoolwithname[j].slice(-halfLength);
        }
        
        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = ws;
    }

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'School Wise Allocation Data' + dateTime + '.xlsx');



}


function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}
