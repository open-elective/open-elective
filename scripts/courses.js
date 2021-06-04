function addcourse()
{
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
    if(!cname || !cno || !cincapa || !cextcapa || !schooldd)
    {
        window.alert("Please fill All details")
    }
}