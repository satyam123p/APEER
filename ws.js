import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
import * as webRTCHandler from "./webRTCHandler.js"; 
// EVENT LISTENERS THAT THE BROWSER'S WEBSOCKET OBJECT GIVES US
export function registerSocketEvents(wsClientConnection) {
    // update our user state with this wsClientConnection
    state.setWsConnection(wsClientConnection);
    // listen for those 4 events
    wsClientConnection.onopen = () => {
        // register the remaining 3 events
        wsClientConnection.onmessage = handleMessage;
    }
}
export function sendAnswer(answer) {
    const message = {
        label: state.labels.WEBRTC_PROCESS, 
        data: {
            type: state.type.WEB_RTC.ANSWER,
            answer, 
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message));
};
// OUTGOING:SENDING ICE CANDIDATES TO THE OTHER PEER
export function sendIceCandidates(arrayOfIceCandidates) {
    const message = {
        label: state.labels.WEBRTC_PROCESS,
        data: {
            type: state.type.WEB_RTC.ICE_CANDIDATES,
            candidatesArray: arrayOfIceCandidates,
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().userWebSocketConnection.send(JSON.stringify(message));
};
// ############## INCOMING WEBSOCKET MESSAGES
function handleMessage(incomingMessageEventObject) {
    const message = JSON.parse(incomingMessageEventObject.data);
    // process an incoming message depending on its label
    switch(message.label) {
        // NORMAL SERVER STUFF
        case state.labels.NORMAL_SERVER_PROCESS:
            normalServerProcessing(message.data);
            break;
        // WEBRTC SERVER STUFF
        case state.labels.WEBRTC_PROCESS:
            webRTCServerProcessing(message.data);
            break;
        default: 
            console.log("unknown server processing label: ", message.label);
    }
};
function normalServerProcessing(data) {
    // process the message depending on its data type
    switch(data.type) {
        case state.type.ROOM_JOIN.RESPONSE_SUCCESS: 
            joinSuccessHandler(data);
            break; 
        case state.type.ROOM_JOIN.RESPONSE_FAILURE: 
            console("Join room is failed.",data.message);
            break; 
        case state.type.ROOM_JOIN.NOTIFY: 
            joinNotificationHandler(data);
            break; 
        case state.type.ROOM_EXIT.NOTIFY:
            exitNotificationHandler(data);
            break;
        case state.type.ROOM_DISONNECTION.NOTIFY:
            exitNotificationHandler(data);
            break;
        default: 
            console.log("unknown data type: ", data.type);
    }
};
function webRTCServerProcessing(data) {
    switch(data.type) {
        case state.type.WEB_RTC.OFFER:
            webRTCHandler.handleOffer(data);
            break;
        case state.type.WEB_RTC.ANSWER:
            webRTCHandler.handleAnswer(data);
            break; 
        case state.type.WEB_RTC.ICE_CANDIDATES:
            webRTCHandler.handleIceCandidates(data);
            break; 
        default: 
            console.log("Unknown data type: ", data.type);
    }
};
function joinNotificationHandler(data) {
    alert(`User ${data.joinUserId} has joined your room`);
    state.setOtherUserId(data.joinUserId); // make sure this is set to the ID of the peer joining the room 
};
// notify the user still in the room, that the other peer has left the room
function exitNotificationHandler(data) {
    uiUtils.updateUiForRemainingUser();
    webRTCHandler.closePeerConnection();
};