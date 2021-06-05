async function getData()
{
document.getElementById("navname").innerHTML = await firebase.auth().currentUser.photoURL;
document.getElementById("navemail").innerHTML = await firebase.auth().currentUser.email;
}
function logout() {
    firebase.auth().signOut().then(() => {
        window.alert("Logout successfull")
        window.location.href = "/index.html";
    }).catch((error) => {
        window.alert(error.message)
    });
}

//auth change
firebase.auth().onAuthStateChanged((user) => {
    if (user && document.getElementById("navname").innerHTML!=""){
        getData();
    }
    else if(!user)
    {
        window.location.href = "/index.html";
    }
});