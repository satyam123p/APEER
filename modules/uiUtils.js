import * as state from "./state.js";
const inputRoomNameElement = document.getElementById('input_room_channel_name');
const joinRoomButton = document.getElementById('join_button');
const exitButton = document.getElementById('exit_button');
const destroyRoomButton = document.getElementById('destroyRoomButton');
export const DOM={
    inputRoomNameElement,
    destroyRoomButton,
    joinRoomButton,
    exitButton,
}
export function exitRoom() {
    inputRoomNameElement.value = '';
    state.resetState();
}
export function addIncomingMessageToUi(msg) {
    const otherUserId = state.getState().otherUserId;
    const formattedMessage = `${otherUserId}: ${msg}`;
    console.log(formattedMessage);
}
