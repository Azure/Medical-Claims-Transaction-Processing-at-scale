/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Upload Js
 */
const handleChange = function() {
  const fileUploader = document.querySelector('#input-file');
      const getFile = fileUploader.files
      if (getFile.length !== 0) {
          const uploadedFile = getFile[0];
          readFile(uploadedFile);
      }
  }
  const readFile = function (uploadedFile) {
      if (uploadedFile) {
          const reader = new FileReader();
          reader.onload = function () {
          const parent = document.querySelector('.preview-box');
          parent.innerHTML = `<img class="preview-content" src=${reader.result} />`;
          };
          
          reader.readAsDataURL(uploadedFile);
      }
  };

  var uppy = new Uppy.Core()
        .use(Uppy.Dashboard, {
          inline: true,
          target: '#drag-drop-area'
        })
        .use(Uppy.Tus, {endpoint: 'https://tusd.tusdemo.net/files/'})

      uppy.on('complete', (result) => {
        // console.log('Upload complete! We’ve uploaded these files:', result.successful)
      })

