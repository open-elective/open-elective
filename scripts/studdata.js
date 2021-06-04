var input = document.getElementById('exl');
input.addEventListener('change', function () {
    readXlsxFile(input.files[0]).then(function (data) {
        console.log(data)
        checkValidity(data)
    });
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
                    message: "Invalid PRN at : row("+(i+1).toString()+")  {"+ data[i][0].toString()+", "+data[i][1].toString()+", "+data[i][2].toString()+", "+data[i][3].toString()+"}",
                    error: new Error()
                };
            }
            if (data[i][2]>10 || data[i][2]<0) {
                throw {
                    message: "Invalid CGPA at : row("+(i+1).toString()+")  {"+ data[i][0].toString()+", "+data[i][1].toString()+", "+data[i][2].toString()+", "+data[i][3].toString()+"}",
                    error: new Error()
                };
            }
            var branch = data[i][3].toString()
            if (!(branch == "SCET" || branch =="SEE" || branch =="SMCEM" || branch == "SMCEC" || branch =="SCE")) {
                throw {
                    message: "Invalid Branch at : row("+(i+1).toString()+")  {"+ data[i][0].toString()+", "+data[i][1].toString()+", "+data[i][2].toString()+", "+data[i][3].toString()+"}",
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
async function uploaddata(data)
{
    var i;
    await firebase.firestore().collection("Misc").doc("State").get().then((doc) => {
        if (doc.exists) {
            if(doc.data()["Allow"]==3)
            {
                window.alert("Result is already Published, This upload won't affect allocation now");
            }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    for(i = 1; i < data.length; i++)
    {
        console.log("in loop"); 
        await firebase.firestore().collection("studentData").doc(data[i][0].toString()).set({
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
    }
}