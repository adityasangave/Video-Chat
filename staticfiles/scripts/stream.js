const APP_ID = "fba883be51524f7ca7dc32812b446325"
const channel = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('uid')

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localStreamTracks = []
let remoteUsers = {}

const readAndCreateVideoClient = async () => {
    document.getElementById('room-name').innerText = channel

    client.on('user-published', handleUserJoin)
    client.on('user-left', handleUserLeft)

    await client.join(APP_ID, channel, TOKEN, null);

    localStreamTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="video-player" id="user-${UID}"></div>
                </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localStreamTracks[1].play(`user-${UID}`);

    await client.publish([localStreamTracks[0], localStreamTracks[1]]);
}

let handleUserJoin = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video') {
        let player = document.getElementById(`user-${user.uid}`)
        if (player != null) {
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveandRemoveLocalTracks = async () => {
    for (i = 0; i < localStreamTracks.length; i++) {
        localStreamTracks[i].stop()
        localStreamTracks[i].close()
    }
    await client.leave()
    window.open('/', '_self');
}

let toggleCamera = async (e) => {
    if (localStreamTracks[1].muted) {
        await localStreamTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    } else {
        await localStreamTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toggleMic = async (e) => {
    if (localStreamTracks[0].muted) {
        await localStreamTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    } else {
        await localStreamTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

readAndCreateVideoClient();
document.getElementById("leave-btn").addEventListener("click", leaveandRemoveLocalTracks)
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);

