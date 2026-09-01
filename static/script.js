const socket = io();

let username = "";
let room = "";


/* =========================================
   GENERATE RANDOM ROOM
========================================= */

function generateRoom() {

    const randomRoom =
        "DR-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    document.getElementById("room").value = randomRoom;

}


/* =========================================
   JOIN ROOM
========================================= */

function joinRoom() {

    username =
        document
            .getElementById("username")
            .value
            .trim();

    room =
        document
            .getElementById("room")
            .value
            .trim();


    if (!room) {

        alert("Please enter a room code.");

        return;

    }


    if (!username) {

        username =
            "Anonymous-" +
            Math.floor(Math.random() * 9999);

    }


    socket.emit("join_room", {

        username: username,
        room: room

    });


    document
        .getElementById("connect-page")
        .style
        .display = "none";


    document
        .getElementById("chat-page")
        .style
        .display = "block";


    document
        .getElementById("room-name")
        .innerText = room;


    document
        .getElementById("messageInput")
        .focus();

}


/* =========================================
   SEND MESSAGE
========================================= */

function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    socket.emit("send_message", {

        username: username,
        room: room,
        message: message

    });


    addMessage(
        username,
        message,
        true
    );


    input.value = "";

    scrollBottom();

}


/* =========================================
   RECEIVE MESSAGE
========================================= */

socket.on(
    "receive_message",
    (data) => {

        if (
            data.username === "SYSTEM"
        ) {

            addSystemMessage(
                data.message
            );

            return;

        }


        if (
            data.username !== username
        ) {

            addMessage(
                data.username,
                data.message,
                false
            );

        }

    }
);


/* =========================================
   ADD MESSAGE
========================================= */

function addMessage(
    sender,
    text,
    isMe
) {

    const messages =
        document.getElementById("messages");


    const msg =
        document.createElement("div");


    msg.classList.add("message");


    if (isMe) {

        msg.classList.add("me");

    } else {

        msg.classList.add("other");

    }


    const name =
        document.createElement("div");

    name.classList.add("username");

    name.textContent = sender;


    const content =
        document.createElement("div");

    content.classList.add("msgtext");

    content.textContent = text;


    msg.appendChild(name);

    msg.appendChild(content);


    messages.appendChild(msg);


    scrollBottom();

}


/* =========================================
   SYSTEM MESSAGE
========================================= */

function addSystemMessage(text) {

    const messages =
        document.getElementById("messages");


    const msg =
        document.createElement("div");


    msg.classList.add(
        "system-message"
    );


    msg.textContent = text;


    messages.appendChild(msg);


    scrollBottom();

}


/* =========================================
   CLEAR CHAT
========================================= */

function clearChat() {

    const messages =
        document.getElementById("messages");


    messages.innerHTML = "";

}


/* =========================================
   ENTER KEY - ROOM
========================================= */

document
    .getElementById("room")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                joinRoom();

            }

        }
    );


/* =========================================
   ENTER KEY - MESSAGE
========================================= */

document
    .getElementById("messageInput")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


/* =========================================
   AUTO SCROLL
========================================= */

function scrollBottom() {

    const messages =
        document.getElementById("messages");


    setTimeout(() => {

        window.scrollTo({

            top:
                document.body.scrollHeight,

            behavior: "smooth"

        });

    }, 50);

}