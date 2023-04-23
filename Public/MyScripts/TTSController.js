// TextToSpeechController.js
// Version: 0.1.0
// Event: On Awake
// Description: Synthesize any provided text in English with TextToSpeech module 
// and expose Audio Track and words info results through public functions that 
// can be accessed across this project

// @input Asset.TextToSpeechModule tts {"label": "Text To Speech"}
// @input Component.AudioComponent audio
// @ui {"widget":"separator"}
// @input string voiceName {"widget":"combobox", "values":[{"label":"Sasha", "value":"Sasha"}, {"label":"Sam", "value":"Sam"}]}
// @input int voiceStyleSasha {"label": "Voice Style","widget":"combobox","showIf":"voiceName","showIfValue":"Sasha","values":[{"label":"Sasha - 1", "value":1},{"label":"Sasha - 2", "value":2},{"label":"Sasha - 3", "value":3},{"label":"Sasha - 4", "value":4},{"label":"Sasha - 5", "value":5},{"label":"Sasha - 6", "value":6}]}
// @input int voiceStyleSam {"label": "Voice Style","widget":"combobox","showIf":"voiceName","showIfValue":"Sam","values":[{"label":"Sam - 1", "value":1}]}
// @input float voicePace {"widget":"slider", "min":0.75, "max":1.50, "step":0.25}
// @ui {"widget":"label", "label":"NOTE: Enable the Preview TTS checkbox and fill in<br/>the Preview Text to preview the TTS result. The preview <br/> text will automatically be spoken on Lens start."}
// @input bool previewTTS {"label": "Preview TTS"}
// @input string previewText {"showIf":"previewTTS"}

var onTTSCompleteHandler = function(callback) {
return function(audioTrackAsset, wordInfos) {
print("TTS Event: On TTS Complete"); 
callback(audioTrackAsset, wordInfos,script.audio);
};

};

var onTTSErrorHandler = function(error,description) {
print("TTS Event: Error: " + error + " Description: "+ description);
};


function getOptions() {
var options = TextToSpeech.Options.create();
options.voiceName = script.voiceName;
if (script.voiceName === TextToSpeech.VoiceNames.Sasha) {
options.voiceStyle = script.voiceStyleSasha;
} else {
options.voiceStyle = script.voiceStyleSam;
}
options.voicePace = script.voicePace*100;
return options;
}


function getTTSResults(text, callback) {
if (script.previewTTS) {
print("Alert: Preview TTS Audio might be cut off by a new Audio. Uncheck the Preview TTS to disable the preview.");
}

var options = getOptions();
script.tts.synthesize(text, options, onTTSCompleteHandler(callback), onTTSErrorHandler);
print("TTS Event: On TTS Create: "+ text); 
}



var previewTTSErrorHandler = function(error,description) {
print("TTS Preview Event: Error: " + error + " Description: "+ description);
};

var previewTTSCompleteHandler = function(audioTrackAsset, wordInfos) {
print("TTS Preview Event: On TTS Complete"); 
script.audio.audioTrack = audioTrackAsset;
script.audio.play(1);
};

function initialize() { 
if (!script.tts) {
print("ERROR: Make sure to set the TTS");
return;
}

if (!script.audio) {
print("ERROR: Make sure to set the Audio Component");
return; 
}
if (script.previewTTS && script.previewText) {
var options = getOptions();
script.tts.synthesize(script.previewText, options, previewTTSCompleteHandler, previewTTSErrorHandler);
}

}

initialize();

global.getTTSResults = getTTSResults;
