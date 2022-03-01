import express from 'express';
const router = express.Router();
import ytdl from 'ytdl-core';
import str from '@supercharge/strings';
import fs from 'fs';
import remove from './remove'
import ffmpeg from 'fluent-ffmpeg';

router.get('/', (req, res) => {
  if (!req.query.url) { //何も指定されてないときの処理
    res.send('GET /mp3?url=videoid');
  } else {
    const videoID = `${req.query.url}`;
    const filename = str.random(30); //ランダムなファイル名を定義
    const audioFile = `tmp/${filename}.m4a`;
    const outFile = `tmp/${filename}_out.mp3`;
    console.log(`Start ${videoID} => mp3`);
    (async () => {
      try {
        const title = (await ytdl.getInfo(videoID)).videoDetails.title; //タイトルを取得
        res.set({'Content-Disposition': `attachment; filename=${encodeURIComponent(title)}.mp3`});
        ytdl(videoID, {quality: 'highestaudio'}).pipe(fs.createWriteStream(audioFile)) //音声ファイルを取得
          .on('finish', () => {
            console.log(`${videoID} => ${audioFile}`);
            ffmpeg(audioFile)
              .audioCodec('libmp3lame')
              .audioBitrate('256k')
              .save(outFile)
              .on('end', () => {
                console.log(`${audioFile} => ${outFile}`);
                remove(audioFile);
                fs.createReadStream(outFile)
                 .pipe(res)
                 .on('finish', () => {
                   remove(outFile);
                 });
              });
          });
      } catch(e) {
        res.status(500).send('Error');
        console.log(e);
        remove(audioFile);
        remove(outFile);
      }
    })();
  }
});

export default router;