import * as uiUtils from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
import * as state from "./modules/state.js";
import * as webRTCHandler from "./modules/webRTCHandler.js";
// Generate unique user code for every user that visits the page
const userId = Math.round(Math.random() * 1000000);
// initialize the DOM
uiUtils.initializeUi(userId);
// establish a ws connection
const wsClientConnection = new WebSocket(`ws://localhost:8080/?userId=${userId}`);
// pass all of our websocket logic to another module
ws.registerSocketEvents(wsClientConnection);
// create room
uiUtils.DOM.createRoomButton.addEventListener("click", () => {
   const roomName = uiUtils.DOM.inputRoomNameElement.value;
   if(!roomName) {
    return alert("Your room needs a name");
   };
   fetch('http://localhost:8080/create-room', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({roomName, userId})
   })
   .then( response => response.json() )
   .then(resObj => {   
      if(resObj.data.type === state.type.ROOM_CREATE.RESPONSE_SUCCESS) {
         state.setRoomName(roomName);
         uiUtils.creatorToProceedToRoom();
      }
      if(resObj.data.type === state.type.ROOM_CREATE.RESPONSE_FAILURE) {
         console.log("Failure while creating room:->",resObj.data.message);
      }  
   })
   .catch(err => {
           console.log("an error ocurred trying to create a room: ", err);
   })
});
// destroying a room (before peer2 has entered/joined the room)
uiUtils.DOM.destroyRoomButton.addEventListener("click", () => {
   const roomName = state.getState().roomName;
   fetch('http://localhost:8080/destroy-room', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({roomName})
   })
   .then( response => response.json() )
   .then(resObj => {   
      if(resObj.data.type === state.type.ROOM_DESTROY.RESPONSE_SUCCESS) {
         uiUtils.exitRoom();
      }
      if(resObj.data.type === state.type.ROOM_DESTROY.RESPONSE_FAILURE) {
         console.log("Destroy room failure",resObj.data.message);
      } 
   })
   .catch(err => {
      console.log("an error ocurred trying to destroy a room: ", err);
   })
})
// joining a room (peer2)
uiUtils.DOM.joinRoomButton.addEventListener("click", () => {
   const roomName = uiUtils.DOM.inputRoomNameElement.value; 
   if(!roomName) {
      return alert("You have to join a room with a valid name");
   }
   ws.joinRoom(roomName, userId, wsClientConnection);
});
// exit a room (either peer)
uiUtils.DOM.exitButton.addEventListener("click", () => {
   const roomName = state.getState().roomName;
   uiUtils.exitRoom();
   ws.exitRoom(roomName, userId);
   alert(`You have left room ${roomName}`);
   // close the peer connection and the data channel (if they exist)
   webRTCHandler.closePeerConnection();
});
uiUtils.DOM.sendMessageButton.addEventListener("click", () => {
   const message = uiUtils.DOM.messageInputField.value.trim();
   if(message) {
      // step 1: add the message to the user's UI
      uiUtils.addOutgoingMessageToUi(message);
      // step 2: sending the message to the other peer
      webRTCHandler.sendMessageUsingDataChannel(message);
   };
});