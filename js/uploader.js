// execute logic on DOM loaded
document.addEventListener("DOMContentLoaded", () => {

  // retrieve important DOM elements
  const fileUploadElem = document.querySelector("input#file-upload")
  const formElem = document.querySelector("form#file-upload-form")
  const selectedFilesList = document.querySelector("ul#selected-files-list")
  
  // file input change event - create list item for each selected file
  fileUploadElem.addEventListener("change", (event) => {
    // careful treating NodeLists like arrays; in old browsers theyre missing many of the properties
    Array.from(fileUploadElem.files).forEach((file) => {
      let listItem = document.createElement('li')
      listItem.innerHTML = file.name + ' - ' + file.type
      selectedFilesList.appendChild(listItem)

      let progressElem = document.createElement('progress')
      progressElem.setAttribute('value',0)
      listItem.appendChild(progressElem)

      // save reference to create DOM element in file
      file.domElement = listItem

    })
  })

  // form submit event
  formElem.addEventListener("submit", (event) => {
    // prevent normal form submit behavior 
    event.preventDefault()
    
    // prepare promise execution context
    const promiseContext = {
      formElem: formElem,
      fileUploadElem: fileUploadElem,
      selectedFilesList: selectedFilesList
    }

    // use AsyncSequenceIterator class to upload files sequentially
    const iterationCount = fileUploadElem.files.length - 1
    new AsyncSequenceIterator(iterationCount, createUploadPromise, promiseContext).whenComplete.then( 
      // success
      () => {
        alert('All uploads completed successfully!')
      },
      // failure
      () => {
        alert('Error during file uploads.')
      }
    // disable any further uploads until page refresh
    ).finally( () => {
      formElem.querySelector('input[type=submit').disabled = true
    })

  })

})

function createUploadPromise(iteration) {

  return new Promise((resolve,reject) => {
    // create FormData object - add file and form fields manually
    const formData = new FormData()
    formData.append('fileUpload', this.fileUploadElem.files[iteration])
    // dispatch xhr to start file upload - listen to file upload complete event and notify user
    let xhr = new XMLHttpRequest()

    // set onload (i.e. upload completion) callback
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.selectedFilesList.querySelectorAll('li')[iteration].style.color = 'darkgreen'
        resolve()
      } else {
        this.selectedFilesList.querySelectorAll('li')[iteration].style.color = 'red'
        reject()
      }
    }

    // watch for file upload progress
    xhr.upload.addEventListener('progress', (e) => {
      this.selectedFilesList.querySelectorAll('progress')[iteration].setAttribute("value", (e.loaded / e.total * 100) )
    })
    
    // initiate AJAX request
    xhr.open("POST", this.formElem.action)
    xhr.send(formData)

  })

}