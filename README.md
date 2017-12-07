# Muffcast
An alternative to Chromecast working with every website with HTML5 Video/Audio elements by just playing HTML5 video/audio on other Firefox instance in full-screen.

## Server
This is the server extension. Install on a device for playing HTML5 Videos in full-screen controlled by [Muffcast Client](https://github.com/Lurkars/Muffcast-Client)s. 

### Requirements
- Firefox/Browser instance
- Internet access

To benefit of this extension, [Muffcast Client](https://github.com/Lurkars/Muffcast-Client) is required on other Firefox/Browser instance in the same network.

### Firefox/Browser Setup
For full-screen support, following setup in Firefox is required
In *about:config* `full-screen-api.allow-trusted-requests-only = false`

On stopped playback, images from unsplash.com are loaded. If you have an unsplash API account, feel free to enter your API-key and credit name for Hotlinking.

### System Setup
Native application *muffcast.py* is required for working properly with client extension.
Setup for native application as described here https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging

*muffcast.json*
```
{
  "name": "muffcast",
  "path": *path to muffcast.py*,
  "type": "stdio",
  "allowed_extensions": ["muffcast@champonthis.de"]
}
```

### Additional Raspberry Pi Configuration
- ARCH Linux
- Matchbox Window Manager
- Firefox with Extension

Raspberry Pi is limited on playing HTML5 videos in browser. Do not expect to play 1080p videos smoothly.

#### Limitations
- This only works for websites with HTML5 Video/Audio elements. This does not work in native applications.
- To work properly for websites with authentication (like Netflix), the browser on server side also needs valid session. This extension does not handle any authentication, so valid sessions are required. In short: manually login and save session before use.
- There are some websites that required further interactions before the HTML5 Video is loaded properly, e.g. to click a non-standard play button. Those sites do not work without special treatment in the server component. Please feel free to report issues with those sites for being included in server component code.
- This extension is developed and tested in Firefox 57. A port for other browsers like Chrome should be easy due to WebExtensions API, but is not warranted to work properly.
- Video quality is not part of the Media API and any websites handles this on it's own. So like authentication, to control playback quality, manually settings on server side are required. (Hopefully the automatic settings fit your needs, but e.g. on a Raspberry Pi to high quality can cause stuttering.)
