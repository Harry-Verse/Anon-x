from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)

# Change this in production using environment variables
app.config["SECRET_KEY"] = "dark-room-secret-key"

# Use threading mode instead of deprecated Eventlet
socketio = SocketIO(
    app,
    async_mode="threading",
    cors_allowed_origins="*"
)

# Connected users
users = {}


# ================= HOME =================

@app.route("/")
def home():
    return render_template("index.html")


# ================= JOIN ROOM =================

@socketio.on("join_room")
def join(data):

    username = data.get("username", "Anonymous")
    room = data.get("room", "").strip()

    if not room:
        return

    users[request.sid] = {
        "username": username,
        "room": room
    }

    join_room(room)

    emit(
        "receive_message",
        {
            "username": "SYSTEM",
            "message": f"{username} connected"
        },
        room=room
    )


# ================= SEND MESSAGE =================

@socketio.on("send_message")
def message(data):

    username = data.get("username", "Anonymous")
    room = data.get("room", "").strip()
    text = data.get("message", "").strip()

    if not room or not text:
        return

    emit(
        "receive_message",
        {
            "username": username,
            "message": text
        },
        room=room
    )


# ================= USER DISCONNECTED =================

@socketio.on("disconnect")
def disconnect_user():

    if request.sid in users:

        username = users[request.sid]["username"]
        room = users[request.sid]["room"]

        emit(
            "receive_message",
            {
                "username": "SYSTEM",
                "message": f"{username} disconnected"
            },
            room=room
        )

        del users[request.sid]


# ================= WEBRTC OFFER =================

@socketio.on("offer")
def offer(data):

    room = data.get("room")

    if room:

        emit(
            "offer",
            data,
            room=room,
            include_self=False
        )


# ================= WEBRTC ANSWER =================

@socketio.on("answer")
def answer(data):

    room = data.get("room")

    if room:

        emit(
            "answer",
            data,
            room=room,
            include_self=False
        )


# ================= ICE CANDIDATE =================

@socketio.on("ice_candidate")
def ice_candidate(data):

    room = data.get("room")

    if room:

        emit(
            "ice_candidate",
            data,
            room=room,
            include_self=False
        )


# ================= RUN SERVER =================

if __name__ == "__main__":

    import os

    port = int(
        os.environ.get("PORT", 5000)
    )

    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=True,
        allow_unsafe_werkzeug=True
    )