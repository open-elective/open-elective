const Auth = firebase.auth()
async function getData()
{
document.getElementById("navname").innerHTML = await Auth.currentUser.photoURL;
document.getElementById("navemail").innerHTML = await Auth.currentUser.email;
}
function logout() {
    Auth.signOut().then(() => {
        window.alert("Logout successfull")
        window.location.href = "/index.html";
    }).catch((error) => {
        window.alert(error.message)
    });
}

//auth change
Auth.onAuthStateChanged((user) => {
    if (user && document.getElementById("navname").innerHTML!=""){
        getData();
    }
    else if(!user)
    {
        window.location.href = "/index.html";
    }
});