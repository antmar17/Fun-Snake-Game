import socketio

# set up client object
sio = socketio.Client()
sio.connect("https:://localhost:3000")

# evenetsand stuffs


@sio.event
def connect():
    print('connection established')


@sio.event
def message(data):
    print('message received with ', data)
    sio.emit('my response', {'response': 'my response'})


@sio.event
def disconnect():
    print('disconnected from server')


sio.connect('http://localhost:5000')
sio.wait()
