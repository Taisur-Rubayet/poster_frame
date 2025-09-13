const uploadInput = document.getElementById('upload');
const uploadedImage = document.getElementById('uploadedImage');
const frameImage = document.getElementById('frameImage');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captionContainer = document.getElementById('captionContainer');
const captionTextDiv = document.getElementById('captionText');
const copyCaptionBtn = document.getElementById('copyCaptionBtn');

let cropper;

// Circle parameters
const circle = { x:540, y:595, width:435.07, height:435.07 };

uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage.src = reader.result;
    uploadedImage.style.display = 'block';

    if(cropper) cropper.destroy();
    cropper = new Cropper(uploadedImage, {
      viewMode: 1,
      aspectRatio: 1,
      autoCropArea: 1,
      responsive: true,
      background: false
    });

    cropBtn.style.display = 'inline-block';
    downloadBtn.style.display = 'none';
    frameImage.style.display = 'none';
    captionContainer.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

cropBtn.addEventListener('click', () => {
  if(!cropper) return;

  const croppedCanvas = cropper.getCroppedCanvas({
    width: circle.width,
    height: circle.height
  });

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Circle mask
  ctx.save();
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.width/2, 0, Math.PI*2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(croppedCanvas, circle.x - circle.width/2, circle.y - circle.height/2, circle.width, circle.height);
  ctx.restore();

  // Draw poster frame
  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

  // Update preview
  frameImage.style.display = 'block';
  uploadedImage.style.display = 'none';
  cropBtn.style.display = 'none';
  downloadBtn.style.display = 'inline-block';

  uploadedImage.src = canvas.toDataURL('image/png');
  uploadedImage.style.display = 'block';

  // Show caption
  captionTextDiv.innerHTML = `
    ✨ 20 Years of Excellence ✨<br>
    🎉 DIU Textile Mega Carnival 2025 🎉<br>
    Frame link: <a href="https://taisur-rubayet.github.io/poster_frame/" target="_blank">poster-frame link</a>
  `;
  captionContainer.style.display = 'block';

  if(cropper){ cropper.destroy(); cropper=null; }
});

copyCaptionBtn.addEventListener('click', () => {
  const textToCopy = `✨ 20 Years of Excellence ✨
🎉 DIU Textile Mega Carnival 2025 🎉
Frame link: https://taisur-rubayet.github.io/poster_frame/`;
  navigator.clipboard.writeText(textToCopy)
    .then(()=> alert('Caption copied!'))
    .catch(()=> alert('Failed to copy caption.'));
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'Poster.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

