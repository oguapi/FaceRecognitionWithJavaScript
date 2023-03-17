# FaceRecognitionWithJavaScript
Application of the face-api to reconice three different faces.

## Face-api
We use face-api to do the detections, this is a JavaScript face recognition API for the browser implemented on top of tensorflow.js. See the [official repository](https://github.com/justadudewhohacks/face-api.js),
where we downloaded the library in [this](https://github.com/justadudewhohacks/face-api.js/blob/master/dist/face-api.min.js) seccion.

### Models
Face-api have all global neural network instances in via faceapi.net:

```
console.log(faceapi.nets)
// ageGenderNet
// faceExpressionNet
// faceLandmark68Net
// faceLandmark68TinyNet
// faceRecognitionNet
// ssdMobilenetv1
// tinyFaceDetector
// tinyYolov2
```
To load a model, you have to provide the corresponding manifest.json file as well as the model weight files (shards) as assets. Simply copy them from [weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) seccion of the official repository to your public or assets folder. The manifest.json and shard files of a model have to be located in the same directory and we call with the next form:

```
faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
```

