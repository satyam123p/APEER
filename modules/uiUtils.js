import * as state from "./state.js";
const inputRoomNameElement = document.getElementById('input_room_channel_name');
const landingPageContainer = document.getElementById('landing_page_container');
const joinRoomButton = document.getElementById('join_button');
const createRoomButton = document.getElementById('create_room_button');
const roomInterface = document.getElementById('room_interface');
const messageInputField = document.getElementById('message_input_field');
const sendMessageButton = document.getElementById('send_message_button');
const exitButton = document.getElementById('exit_button');
const destroyRoomButton = document.getElementById('destroyRoomButton');
export const DOM = {
    createRoomButton,
    inputRoomNameElement,
    destroyRoomButton,
    joinRoomButton,
    exitButton,
    sendMessageButton,
    messageInputField,
};
// initialize UI events as soon as user enters page
export function initializeUi(userId) {
    state.setUserId(userId);
};
// ###### ROOM LOGIC
// listen for the enter / return key and trigger the create room button
inputRoomNameElement.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
        createRoomButton.click();
    }
})
// function for the creator to enter the room
export function creatorToProceedToRoom() {
    landingPageContainer.style.display = "none"; // hides the landing page section
    exitButton.classList.add("hide");
    roomInterface.classList.remove("hide"); // showing the room interface
}
export function exitRoom() {
    inputRoomNameElement.value = ''; // Clear input field
    landingPageContainer.style.display = "block"; // show the landing page section again
    roomInterface.classList.add("hide"); // hide the room interface
    // reset state
    state.resetState();
};
export function joineeToProceedToRoom() {
    landingPageContainer.style.display = "none"; // hides the landing page section
    roomInterface.classList.remove("hide"); // showing the room interface
    destroyRoomButton.classList.add("hide");
}; 
export function updateCreatorsRoom() {
    destroyRoomButton.classList.add('hide'); 
    exitButton.classList.remove('hide');
}
export function updateUiForRemainingUser() {
    alert("a user has left your room");
    state.setOtherUserId(null);
    // have to add more logic later related to WebRTC
};
// learning purposes - styling buttons that have been clicked
export function updateUIButton(button, message) {
    // update UI of the button
    button.classList.remove("process_pending");
    button.classList.add("process_complete");
    button.setAttribute("disabled", true);
};
// ### MESSAGE RELATED UI
export function updateUiOnSuccessfullConnection() {
    messageInputField.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            sendMessageButton.click(); 
        }
    }); 
};
export function addOutgoingMessageToUi(message) {
    const userTag = "YOU";
    const formattedMessage = `${userTag}: ${message}`;
    console.log(formattedMessage);
    messageInputField.value = "";
};
export function addIncomingMessageToUi(msg) {
    const otherUserId = state.getState().otherUserId;
    const formattedMessage = `${otherUserId}: ${msg}`;
    console.log(formattedMessage);
    messageInputField.value = "";
}
