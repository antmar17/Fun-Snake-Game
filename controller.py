import socketio
import sys
import json

sio = socketio.Client()


@sio.event
def connect():
    print("connection to node server Established")
    sio.emit("printPy", sio.sid)


@sio.event
def connect_error():
    print("The connection failed!")


@sio.on('msg')
def response(args):
    update = json.loads(args)
    print(update)

    sio.emit("Ack", json.dumps(args))
    print("foo")


@sio.event
def disconnect():
    print("ive disconnected from the server")


if __name__ == "__main__":
    sio.connect('http://localhost:3000')
    sio.wait()


# def read_in():
#    lines = sys.stdin.readlines()
#    # Since our input would only be having one line, parse our JSON data from that
#    return json.loads(lines[0])
#
#
# def main():
#    lines = read_in()
#    print(lines)
#
#
# if __name__ == '__main__':
#    while True:
#
#        main()
