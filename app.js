const MODELS_PATH = './models'
const imageUploadEle = document.getElementById('imageUpload')
const imageDescEle = document.getElementById('imageDesc')
const imageDisplay = document.getElementById('imageDisplay')

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
]).then(start)

function start() {
  imageDescEle.append(' == Image Start == ')
  imageUploadEle.addEventListener('change', async () => {
    console.log('imageUploadEle.files[0]:', imageUploadEle.files[0]);
    const t0 = performance.now()
    const image = await faceapi.bufferToImage(imageUploadEle.files[0])
    const t1 = performance.now()
    imageDescEle.append(' Upload Time:', t1 - t0 , ' type: ', imageUploadEle.files[0].type, ' ')
    
    imageDisplay.append(image)

    const t2 = performance.now()
    const detections = await faceapi.detectAllFaces(image)
    const t3 = performance.now()
    imageDescEle.append(' DetectAllFaces Time:', t3 - t1, ' ')

    imageDescEle.append(' # of face:', detections.length, ' ')
  })
}


const videoEle = document.getElementById('myVideo')
const videoDescEle = document.getElementById('videoDesc')

videoEle.addEventListener('play', () => {
  console.log('== play ==');
  var detecting = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      videoEle,
      new faceapi.TinyFaceDetectorOptions()
    );
    if (detections.length !== 0) {
      videoDescEle.append(' # of face:', detections.length, ' ')
      stopDetecting()
    }
    console.log('detections:', detections)
  }, 100)

  function stopDetecting() {
    clearInterval(detecting)
  }
})

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
]).then(videoStart)

async function videoStart() {
  console.log('== videoStart ==', videoEle)
}
