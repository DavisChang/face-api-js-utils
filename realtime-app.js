const MODELS_PATH = './models'
const video = document.getElementById('video')
let predictedAges = []

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_PATH),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
  faceapi.nets.faceExpressionNet.loadFromUri(MODELS_PATH),
  faceapi.nets.ageGenderNet.loadFromUri(MODELS_PATH),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    error => console.log(error)
  )
}

video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    const gender = resizedDetections[0].gender
    const age = resizedDetections[0].age
    const interpolatedAge = interpolateAgePredictions(age)
    
    const bottomRight = {
      x: resizedDetections[0].detection.box.bottomRight.x - 50,
      y: resizedDetections[0].detection.box.bottomRight.y,
    }
    const topRight = {
      x: resizedDetections[0].detection.box.topRight.x,
      y: resizedDetections[0].detection.box.topRight.y,
    }

    new faceapi.draw.DrawTextField(
      [`${faceapi.utils.round(interpolatedAge, 0)} years`],
      bottomRight
    ).draw(canvas)

    new faceapi.draw.DrawTextField(
      [gender],
      topRight
    ).draw(canvas)

  }, 100)
})

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30)
  const avgPredictedAges = predictedAges.reduce((total, a) => total + a) / predictedAges.length
  return avgPredictedAges
}