require('dotenv').config();
require('colors');
const express = require('express');
const ExpressWs = require('express-ws');
const getCurrentTime = require('./util');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');

const app = express();
ExpressWs(app);

const PORT = process.env.PORT || 3000;

app.post('/incoming', (req, res) => {
  res.status(200);
  res.type('text/xml');
  res.end(`
  <Response>
    <Connect>
      <Stream url="wss://${process.env.SERVER}/connection" />
    </Connect>
  </Response>
  `);
});

app.ws('/connection', (ws) => {
  ws.on('error', console.error);
  // Filled in from start message
  let streamSid;

  const gptService = new GptService();
  const streamService = new StreamService(ws);
  const transcriptionService = new TranscriptionService();
  const ttsService = new TextToSpeechService({});
  
  let marks = [];
  let interactionCount = 0;

  // Incoming from MediaStream
  ws.on('message', function message(data) {
    const msg = JSON.parse(data);
    if (msg.event === 'start') {
      streamSid = msg.start.streamSid;
      streamService.setStreamSid(streamSid);
      console.log(`${getCurrentTime()} Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
      ttsService.generate({partialResponseIndex: null, partialResponse: 'Hello! I understand you\'re either looking for scheduling a meeting or any order status. Is that correct?'}, 1);
    } else if (msg.event === 'media') {
      transcriptionService.send(msg.media.payload);
    } else if (msg.event === 'mark') {
      const label = msg.mark.name;
      console.log(`${getCurrentTime()} Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
      marks = marks.filter(m => m !== msg.mark.name);
    } else if (msg.event === 'stop') {
      console.log(`${getCurrentTime()} Twilio -> Media stream ${streamSid} ended.`.underline.red);
    }
  });

  transcriptionService.on('utterance', async (text) => {
    // This is a bit of a hack to filter out empty utterances
    if(marks.length > 0 && text?.length > 5) {
      console.log(`${getCurrentTime()} Twilio -> Interruption, Clearing stream`.red);
      ws.send(
        JSON.stringify({
          streamSid,
          event: 'clear',
        })
      );
    }
  });

  transcriptionService.on('transcription', async (text) => {
    if (!text) { return; }
    console.log(`${getCurrentTime()} Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow);
    const startTime = Date.now();
    gptService.completion(text, interactionCount);
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`${getCurrentTime()} GPT processing time: ${duration}ms`.cyan);
    interactionCount += 1;
  });

  gptService.on('gptreply', async (gptReply, icount) => {
    console.log(`${getCurrentTime()} Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green );
    ttsService.generate(gptReply, icount);
  });

  ttsService.on('speech', (responseIndex, audio, label, icount) => {
    console.log(`${getCurrentTime()} Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

    streamService.buffer(responseIndex, audio);
  });

  streamService.on('audiosent', (markLabel) => {
    marks.push(markLabel);
  });
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
