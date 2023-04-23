// GreetingController.js
// Version: 0.1.0
// Event: On Awake
// Description: Create TTS callback with TTS Text Component, get TTS results and animate TTS Text Component with TTS audio playback. 

// @input Component.Text ttsText {"label": "TTS Text"}
// @input SceneObject tapBehavior
//// @input SceneObject SpeakerHint

var initialized = false; 
var ttsStart = false;
var timeline = [];
var updateTime = 0;
var currentCount = 0;

script.api.speakWithTTSInput = speakWithTTSInput;

script.createEvent("UpdateEvent").bind(function(eventData) {
if (!initialized) {
return;
}

if (!ttsStart) {
return; 
}
updateTime = updateTime + eventData.getDeltaTime();
if (updateTime >= timeline[currentCount].time) {
script.ttsText.text = script.ttsText.text +" " + timeline[currentCount].word;
currentCount++; 
}
if (currentCount == timeline.length) {
ttsStart =false;
currentCount = 0;
updateTime = 0;
timeline = [];
script.tapBehavior.enabled = true;
}
});

// TTS Functions
function speakWithTTSInput(text) {
//script.tapBehavior.enabled = false;
    
script.ttsText.text=text;
    
speak(script.ttsText.text);
script.ttsText.text = "Generating TTS audio...";
} 

function speakWithTTSInput2() {
script.tapBehavior.enabled = false;
    
    
if (script.ttsText.text == "" || script.ttsText.text.includes("Unknown")) {
speak("Hello there! I can't get the weather information");
return;
}
speak(script.ttsText.text);
script.ttsText.text = "Generating TTS audio...";
} 

function speak(text) {
global.getTTSResults(text, TTSCompleteHandler, TTSErrorHandler); 
}

function TTSErrorHandler(error,description) {
script.tapBehavior.enabled = true;
print("Error: " + error + " Description: "+ description);
}

function TTSCompleteHandler(audioTrackAsset, wordInfos,audioComponent) {
for (var i = 0; i < wordInfos.length; i++) {
timeline[i] = {time: wordInfosTimeToSecond(wordInfos[i].startTime), word:wordInfos[i].word};

} 
playTTSAudio(audioTrackAsset, audioComponent);
}


function playTTSAudio(audioTrackAsset, audioComponent) {
audioComponent.audioTrack = audioTrackAsset;
audioComponent.play(1);
script.ttsText.text = "";
//global.tweenManager.startTween(script.SpeakerHint, "AUDIOPLAYTWEEN");
ttsStart = true;
}

function wordInfosTimeToSecond(time) {
return time/1000;
}
function initialize() { 
if (!script.ttsText) {
//print("ERROR: Make sure to set the TTS Text");
return;
}

if (!script.tapBehavior) {
print("ERROR: Make sure to set the Tap Behavior Object");
return; 
}
//if (!script.SpeakerHint) {
//print("ERROR: Make sure to set the Speaker Hint");
//return; 
//}
initialized = true;
}

initialize();
