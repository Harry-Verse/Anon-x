const socket = io();

let username = "";
let room = "";


/* RANDOM ROOM */

function createRandomRoom(){

    const randomRoom =
        "dark-" +
        Math.random()
        .toString(36)
        .substring(2, 10);

    document.getElementById("room").value = randomRoom;

    document.getElementById("room").focus();
}


/* FOCUS ROOM */

function focusRoom(){

    document.getElementById("room").focus();

    document
        .getElementById("room")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


/* JOIN ROOM */

function joinRoom(){

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


    if(room === ""){

        alert("Please enter a room code.");

        return;
    }


    /* OPTIONAL USERNAME */

    if(username === ""){

        username =
            "Anonymous-" +
            Math.floor(
                1000 +
                Math.random() * 9000
            );

    }


    socket.emit("join_room", {

        username: username,

        room: room

    });


    document
        .getElementById("connect-page")
        .style.display = "none";


    document
        .getElementById("chat-page")
        .style.display = "block";


    document
        .getElementById("room-name")
        .innerText = room;


    scrollBottom();
}


/* SEND MESSAGE */

function sendMessage(){

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();


    if(message === ""){
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


/* RECEIVE MESSAGE */

socket.on(
    "receive_message",

    (data) => {

        if(data.username !== username){

            addMessage(

                data.username,

                data.message,

                false

            );

        }

    }

);


/* ADD MESSAGE */

function addMessage(
    sender,
    text,
    isMe
){

    const messages =
        document.getElementById("messages");


    const msg =
        document.createElement("div");


    msg.classList.add("message");


    if(isMe){

        msg.classList.add("me");

    }else{

        msg.classList.add("other");

    }


    /* SAFE TEXT */

    const usernameDiv =
        document.createElement("div");

    usernameDiv.className =
        "username";

    usernameDiv.textContent =
        sender;


    const textDiv =
        document.createElement("div");

    textDiv.className =
        "msgtext";

    textDiv.textContent =
        text;


    msg.appendChild(usernameDiv);

    msg.appendChild(textDiv);


    messages.appendChild(msg);


    scrollBottom();
}


/* CLEAR CHAT */

function clearChat(){

    document
        .getElementById("messages")
        .innerHTML = "";

}


/* ENTER ROOM */

document
.getElementById("room")
.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){

            joinRoom();

        }

    }
);


/* ENTER SEND MESSAGE */

document
.getElementById("messageInput")
.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){

            sendMessage();

        }

    }
);


/* AUTO SCROLL */

const messagesBox =
    document.getElementById("messages");


function scrollBottom(){

    setTimeout(() => {

        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    }, 50);

}