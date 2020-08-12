pilo
====

Lights-out management via Raspberry Pi.

Setup
===

0. Connect everything.
1. Set up an MJPEG streaming server for the USB HDMI capture card.
    1. Follow the instructions on the [`uv4l`](http://www.linux-projects.org/uv4l/installation/) website to install the `apt` sources for `uv4l`.
    2. Update the `apt` index, and install the required packages:
        ```
        apt update
        apt install uv4l uv4l-server uv4l-uvc uv4l-mjpegstream
        ```
    3. Retrieve your USB HDMI capture card's ID by running `lsusb`. It should be a hexadecimal string like `1a2b:3c4d`.
    4. Start the `uv4l` server listening on `127.0.0.1:9000`:
        ```
        uv4l --driver uvc --device-id '534d:2109' --auto-video_nr --server-option '--port=9000' --server-option '--bind-host-address=127.0.0.1'
        ```
       You should be able to access a MJPEG stream of the USB HDMI capture card locally on the Pi at `http://127.0.0.1:9000/stream/video.mjpeg`.
2.
