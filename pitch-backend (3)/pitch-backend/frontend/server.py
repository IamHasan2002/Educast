#!/usr/bin/env python3
"""
Simple HTTP Server for Angular Frontend
Serves static files from the frontend directory
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = int(os.environ.get('FRONTEND_PORT', '8080'))
FRONTEND_DIR = Path(__file__).parent.absolute()

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)
    
    def end_headers(self):
        """Add headers to prevent caching for development"""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        """Route all requests to index.html for AngularJS routing"""
        if self.path == '/' or self.path.startswith('/#'):
            self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(FRONTEND_DIR)
    
    handler = MyHTTPRequestHandler
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True
    try:
        with ReusableTCPServer(("", PORT), handler) as httpd:
            print(f"Frontend Server running at http://localhost:{PORT}")
            print(f"Serving files from: {FRONTEND_DIR}")
            print("Press Ctrl+C to stop the server")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")
                sys.exit(0)
    except OSError as e:
        # If port is in use or not permitted, try the next available port
        winerr = getattr(e, 'winerror', None)
        if winerr in (10048, 10013) or 'address already in use' in str(e).lower():
            fallback = PORT + 1
            with ReusableTCPServer(("", fallback), handler) as httpd:
                print(f"Port {PORT} unavailable. Falling back to http://localhost:{fallback}")
                print(f"Serving files from: {FRONTEND_DIR}")
                print("Press Ctrl+C to stop the server")
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print("\nServer stopped.")
                    sys.exit(0)
        else:
            raise
