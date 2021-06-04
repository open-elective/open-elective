function downloadtemp() {
    var storage = firebase.storage();
    var gsReference = storage.refFromURL('gs://openelectiveallocation.appspot.com/Download/template.xlsx')

    gsReference.getDownloadURL()
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

  })
  .catch((error) => {
    // Handle any errors
  });
}