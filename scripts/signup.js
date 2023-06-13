const details = document.getElementById("details")
const cred = document.getElementById("cred")
details.style.display = "none"
cred.style.display = "none"
async function submitprn() {
    try {
        const prn = document.getElementById("signinPRN")
        const name = document.getElementById("name")
        const school = document.getElementById("school")
        const CGPA = document.getElementById("CGPA")
        if (prn.value.length < 9) {
            throw {
                message: "Invalid PRN (PRN should be 10 or greater than 10 digits)",
                error: new Error()
            };
        }
        var found = false;
        await db.collection("studentData").doc(prn.value).get().then((doc) => {
            const data = doc.data();
            school.innerHTML = "School " + data.School
            CGPA.innerHTML = "CGPA " + data.CGPA
            name.innerHTML = "Name " + data.Name
            found = true
        }).catch((error) => {
            window.alert("You are not in our database, Please contact concerning faculty")
            found = false
        });
        if (found) {
            document.getElementById("signinPRN").disabled = true
            details.style.display = "block"
        }
    }
    catch (err) {
        window.alert(err.message)
    }
}
const all = document.getElementById('verifyprn')
all.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        cred.style.display = "block"
    } else {
        cred.style.display = "none"
    }
})