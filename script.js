const video= document.getElementById("video"); //Getting the video from html file

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
]).then(startWebcam).then(faceRecognition);               //We could be starting the webcam and process before these models are fully and absolutely completely loaded

function startWebcam(){
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,              //Dont need the audio for face recognition
    }).then((stream)=>{             //If everything is executed successfully then we are going to run this piece of code, get stream of webcam
        video.srcObject= stream;    //It going to hook it into the video variable
    }).catch((error)=>{
        console.error(error);
    });
}

function getLabeledFaceDescriptions(){
    const labels= ["Andres", "Messi", "Peter"];

    return Promise.all(
        labels.map(async (label)=> {

            const descriptions= [];
            
            for (let i=1; i <= 2; i++) {
                const image= await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
                console.log(`./labels/${label}/${i}.jpg`);
                const detections= await faceapi
                    .detectSingleFace(image)
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}

async function faceRecognition() {
    const labeledFaceDescriptors= await getLabeledFaceDescriptions();
    const faceMatcher= new faceapi.FaceMatcher(labeledFaceDescriptors);

    video.addEventListener("playing", async () => {
        console.log("Funcion lanzada por el play");
    });
    const canvas= faceapi.createCanvasFromMedia(video);
    
    document.body.append(canvas);

    const displaySize= {width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections= await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors();

        const resizedDetections= faceapi.resizeResults(detections, displaySize);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        const results= resizedDetections.map((d)=> {
            return faceMatcher.findBestMatch(d.descriptor);
        });

        results.forEach((result, i)=> {
            const box= resizedDetections[i].detection.box;
            const drawBox= new faceapi.draw.DrawBox(box, {
                label: result,
            });
            drawBox.draw(canvas);
        });
    }, 100); //function every 100 mileseconds

}