import * as uiUtils from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
import * as state from "./modules/state.js";
import * as webRTCHandler from "./modules/webRTCHandler.js";
// Generate unique user code for every user that visits the page
const userId = Math.round(Math.random()*1000000);
// set userId
state.setUserId(userId);
// establish a ws connection
const wsClientConnection = new WebSocket(`ws://localhost:8080/?userId=${userId}`);
// pass all of our websocket logic to another module
ws.registerSocketEvents(wsClientConnection);
// create room
const roomName = userId + "'s room";
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
   }
   if(resObj.data.type === state.type.ROOM_CREATE.RESPONSE_FAILURE) {
      console.log("Failure while creating room:->",resObj.data.message);
   }  
})
.catch(err => {
   console.log("an error ocurred trying to create a room: ", err);
})
uiUtils.DOM.sendMessageButton.addEventListener("click", () => {
   const message = uiUtils.DOM.messageInputField.value.trim();
   if(message) {
      // step 1: add the message to the user's UI
      uiUtils.addOutgoingMessageToUi(message);
      // step 2: sending the message to the other peer
      webRTCHandler.sendMessageUsingDataChannel(message);
   };
});