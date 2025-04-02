import * as uiUtils from "./uiUtils.js";
import * as ws from "./ws.js";
let pc; // define a global local peer connection object that contains everything we need to establish a WebRTC connection
let dataChannel; // we will set this up when we create a peer connection
const iceCandidatesGenerated = []; // for learning purposes, we will store all ice candidates generated inside of an array
const iceCandidatesReceivedBuffer = [];
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
export async function startWebRTCProces() {
    let offer; 
    // create a peer connection object
    createPeerConnectionObject();
    // create dataChannel
    createDataChannel(true);
    // creating offer
    offer = await pc.createOffer();
    // adding offer to localDescription
    await pc.setLocalDescription(offer); 
    // sending offer to signaling server
    ws.sendOffer(offer);
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
}
// create a data channel
function createDataChannel(isOfferor) {
    // only need to create a data channel once, when an offer is established
    // to mimic UDP type transport on our data channel, set the 'ordered' property to false, and the maxRetransmits to 0
    const dataChannelOptions = {
        ordered: false, 
        maxRetransmits: 0
    };
    dataChannel = pc.createDataChannel("top-secret-chat-room", dataChannelOptions);
    // add event listeners
    registerDataChannelEventListeners();
}
function registerDataChannelEventListeners() {
    dataChannel.addEventListener("message", (e) => {
        console.log("message has been received from a Data Channel");
        // first, we need to extract the actual data from the Data Channel
        const msg = e.data; 
        uiUtils.addIncomingMessageToUi(msg);
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
export async function handleAnswer(data) {
    // send ice candidates
    ws.sendIceCandidates(iceCandidatesGenerated);
    // set remote description
    await pc.setRemoteDescription(data.answer);
    for (const candidate of iceCandidatesReceivedBuffer) {
        await pc.addIceCandidate(candidate);
    }; 
    iceCandidatesReceivedBuffer.splice(0, iceCandidatesReceivedBuffer.length);
};
// handle ice candidates received from the signaling server
export function handleIceCandidates(data) {
    data.candidatesArray.forEach(candidate => {
        iceCandidatesReceivedBuffer.push(candidate);
    });
}
export function closePeerConnection() {
    if(pc) {
        pc.close(); // calling this will automatically close all data channels
        pc = null; // ensure we free up memory by setting pc object to null
        dataChannel = null;
        console.log("You have closed your peer connection by calling the 'close()' method");
    }
};