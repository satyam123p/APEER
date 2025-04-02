import * as state from "./state.js";
const messageInputField = document.getElementById('message_input_field');
const sendMessageButton = document.getElementById('send_message_button');
export const DOM = {
    sendMessageButton,
    messageInputField,
}
export function updateUiForRemainingUser() {
    alert("a user has left your room");
    state.setOtherUserId(null);
};
export function updateUIButton(button) {
    button.setAttribute("disabled", true);
};
export function addOutgoingMessageToUi(message) {
    const userTag = "YOU";
    const formattedMessage = `${userTag}: ${message}`;
    console.log(formattedMessage);
    messageInputField.value = "";
};
