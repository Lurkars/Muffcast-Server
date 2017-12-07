#!/usr/bin/env python

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import sys
import socket
import json
import struct
import re
import select

server_address = ('',8128)
timeout = 15

# Send an encoded message to stdout.
def extensionCall(messageContent):
    sys.stdout.write(struct.pack('@I', len(messageContent)))
    sys.stdout.write(messageContent)
    sys.stdout.flush()
    # wait for extension response
    i, o, e = select.select( [sys.stdin], [], [], timeout)
    if (i):
        rawLength = sys.stdin.read(4)
        if len(rawLength) == 0:
            return True
        messageLength = struct.unpack('@I', rawLength)[0]
        message = sys.stdin.read(messageLength)
        return message
    else:
        return False

class PostHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        response = extensionCall('{"command" : "status"}')
        if response:
            self.send_response(200)
        else:
            self.send_response(500)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(response)

    def do_POST(self):
        buffer = self.rfile.read(int(self.headers['Content-Length']))
        response = extensionCall(buffer)
        if response:
            self.send_response(200)
        else:
            self.send_response(500)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(response)

httpd = HTTPServer(server_address, PostHTTPRequestHandler)
httpd.serve_forever()
