const MODELS_PATH = './models'
const imageUploadEle = document.getElementById('imageUpload')
const imageDescEle = document.getElementById('imageDesc')

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
]).then(start)

function start() {
  imageDescEle.append(' == Image Start == ')
  imageUploadEle.addEventListener('change', async () => {
    
    const t0 = performance.now()
    const image = await faceapi.bufferToImage(imageUploadEle.files[0])
    const t1 = performance.now()
    imageDescEle.append(' Upload Time:', t1 - t0 , ' ')
    
    imageDescEle.append(image)

    const t2 = performance.now()
    const detections = await faceapi.detectAllFaces(image)
    const t3 = performance.now()
    imageDescEle.append(' DetectAllFaces Time:', t3 - t1, ' ')

    imageDescEle.append(' # of face:', detections.length, ' ')
  })
}


const videoEle = document.getElementById('myVideo')
const videoDescEle = document.getElementById('videoDesc')

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
  // faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
]).then(videoStart)

async function videoStart() {
  videoDescEle.append(' == Video Start == ')
  const t2 = performance.now()
  const detections = await faceapi.detectAllFaces(videoEle)
  const t3 = performance.now()
  videoDescEle.append(' DetectAllFaces Time:', t3 - t2, ' ')
  videoDescEle.append(' # of face:', detections.length, ' ')
}