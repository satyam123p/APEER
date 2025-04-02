import * as uiUtils from "./uiUtils.js";
import * as ws from "./ws.js";
// set up global variables
let pc; // define a global local peer connection object that contains everything we need to establish a WebRTC connection
let dataChannel; // we will set this up when we create a peer connection
const iceCandidatesGenerated = []; // for learning purposes, we will store all ice candidates generated inside of an array
// step 1 (md file reference)
const webRTCConfiguratons = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
            ]
        }
    ]
};
// create a users local peer connection object by invoking the RTCPeerConnection object
function createPeerConnectionObject() {
    pc = new RTCPeerConnection(webRTCConfiguratons); // created a pc object that will handle the entire WebRTC session for this peer
    // ### register event listeners
    // #1. listen for WebRTC connection state change event (goal is "connected")
    pc.addEventListener("connectionstatechange", () => {
        console.log("connection state changed to: ", pc.connectionState); 
        if(pc.connectionState === "connected") {
            alert("YOU HAVE DONE IT! A WEBRTC CONNECTION HAS BEEN MADE BETWEEN YOU AND THE OTHER PEER");
        }
    });
    // #2. listen for change in the signaling state
    pc.addEventListener("signalingstatechange", () => {
       console.log(`Signaling state changed to: ${pc.signalingState}`);
    });
    // #3. listen for ice candidate generation
    pc.addEventListener("icecandidate", (e) => {
        if(e.candidate) {
            console.log("ICE:", e.candidate);
            iceCandidatesGenerated.push(e.candidate);
        }
    });
}; 
// create a data channel
function createDataChannel() {
    // the receiver needs to register a ondatachannel listener
    // this will only fire once a valid webrtc connection has been established
    pc.ondatachannel = (e) => {
        dataChannel = e.channel;
        registerDataChannelEventListeners();
    }
}
function registerDataChannelEventListeners() {
    dataChannel.addEventListener("message", (e) => {
        console.log("message has been received from a Data Channel");
    });
    dataChannel.addEventListener("close", (e) => {
        // will fire for all users that are listening on this data channel
        console.log("The 'close' event was fired on your data channel object");
    });
    dataChannel.addEventListener("open", (e) => {
        // this will fire when webrtc connection is established. 
        console.log("Data Channel has been opened. You are now ready to send/receive messsages over your Data Channel");
    });
};
export async function handleOffer(data) {
    let answer; 
    // create a peer connection .
    createPeerConnectionObject(); 
    // listen for ondatachannel event.
    createDataChannel(false);
    // set remote description.
    await pc.setRemoteDescription(data.offer);
    // create answer.
    answer = await pc.createAnswer();
    // set answer to local description.
    await pc.setLocalDescription(answer);
    // send answer.
    ws.sendAnswer(answer);
    // send ice candidates.
    ws.sendIceCandidates(iceCandidatesGenerated);
}
// handle ice candidates received from the signaling server
export function handleIceCandidates(data) {
    try {
        data.candidatesArray.forEach(candidate => {
            pc.addIceCandidate(candidate);
        });
    } catch (error) {
        console.log("Error trying to add an ice candidate to the pc object", error);
    }   
}
export function sendMessageUsingDataChannel(message) {
    dataChannel.send(message);
};  
export function closePeerConnection() {
    if(pc) {
        pc.close(); // calling this will automatically close all data channels
        pc = null; // ensure we free up memory by setting pc object to null
        dataChannel = null;
        console.log("You have closed your peer connection by calling the 'close()' method");
    }
};