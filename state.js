// this is a file to keep all states related to our user
let state = {
    userId: null,
    userWebSocketConnection: null,
    roomName: null,
    otherUserId: null,
};

// generic setter function for our state object
const setState = (newState) => {
    state = {
        ...state,
        ...newState
    }
};

// set the userId
export const setUserId = (userId) => {
    setState({userId});
};

// set the ws object state for the user
export const setWsConnection = (wsConnection) => {
    setState({userWebSocketConnection: wsConnection});
};

// set the roomName 
export const setRoomName = (roomName) => {
    setState({roomName});
}
// set the other user's id
export const setOtherUserId = (otherUserId) => {
    setState({otherUserId})
}

// reset the state object
export const resetState = () => {
    setState({
        roomName: null,
        otherUserId: null,
    })
};

// getter for our state object
export const getState = () => {
    return state;
};

export const myColors = {
    red: "#ff8080",
    green: "#98ff80",
    orange: "#ffcb0f",
    blue: "#5dbcff",
    sendMessageColor: "#b00066",
    receiveMessageColor: "#096900"
};

export const type = {
    ROOM_CREATE: {
        RESPONSE_FAILURE: "CHECK_ROOM_RESPONSE_FAILURE",
        RESPONSE_SUCCESS: "CHECK_ROOM_RESPONSE_SUCCESS", 
    },
    ROOM_DESTROY: {
        RESPONSE_FAILURE: "DESTROY_ROOM_RESPONSE_FAILURE",
        RESPONSE_SUCCESS: "DESTORY_ROOM_RESPONSE_SUCCESS", 
    },
    ROOM_JOIN: {
        RESPONSE_FAILURE: "JOIN_ROOM_RESPONSE_FAILURE",
        RESPONSE_SUCCESS: "JOIN_ROOM_RESPONSE_SUCCESS",
        REQUEST: "JOIN_ROOM_REQUEST",
        NOTIFY: "JOIN_ROOM_NOTIFY" 
    },
    ROOM_EXIT: {
        REQUEST: "EXIT_ROOM_REQUEST",
        NOTIFY: "EXIT_ROOM_NOTIFY" 
    },
    ROOM_DISONNECTION: {
        NOTIFY: "DISCONNECT_ROOM_NOTIFICATION"
    },
    WEB_RTC: {
        OFFER: "OFFER",
        ANSWER: "ANSWER",
        ICE_CANDIDATES: "ICE_CANDIDATES"
    }
};

export const labels = {
    NORMAL_SERVER_PROCESS: "NORMAL_SERVER_PROCESS",
    WEBRTC_PROCESS: "WEBRTC_PROCESS"
};