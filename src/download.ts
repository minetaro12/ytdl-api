import express from 'express';
const router = express.Router();
import ytdl from 'ytdl-core';
import str from '@supercharge/strings';
import fs from 'fs';
import remove from './remove'
import ffmpeg from 'fluent-ffmpeg';

router.get('/', (req, res) => {
  if (!req.query.url) { //何も指定されてないときの処理
    res.send('GET /download?url=videoid');
  } else {
    const videoID = `${req.query.url}`;
    const avcOp = `${req.query.avc}`;
    const aacOp = `${req.query.aac}`;
    const filename = str.random(30); //ランダムなファイル名を定義
    const videoFile = `tmp/${filename}.mp4`;
    const audioFile = `tmp/${filename}.m4a`;
    const outFile = `tmp/${filename}_out.mp4`;
    console.log(`Start ${videoID}`);
    console.log(`avc: ${avcOp}`);
    console.log(`aac: ${aacOp}`);
    (async () => {
      try {
        const title = (await ytdl.getInfo(videoID)).videoDetails.title; //タイトルを取得
        res.set({'Content-Disposition': `attachment; filename=${encodeURIComponent(title)}.mp4`});

        let dlVformat: ytdl.downloadOptions | undefined;
        if(avcOp == '1') { //AVC指定
          // @ts-expect-error
          dlVformat = {quality: 'highestvideo', filter: format => format.videoCodec?.startsWith('avc1')};
        } else {
          dlVformat = {quality: 'highestvideo'};
        };

        let dlAformat: ytdl.downloadOptions | undefined;
        if(aacOp == '1') { //AAC指定
          // @ts-expect-error
          dlAformat = {quality: 'highestaudio', filter: format => format.audioCodec?.startsWith('mp4a')};
        } else {
          dlAformat = {quality: 'highestaudio'};
        };

        ytdl(videoID, dlVformat).pipe(fs.createWriteStream(videoFile)) //動画ファイルを取得
          .on('finish', () => {
            console.log(`${videoID} => ${videoFile}`);
            ytdl(videoID, dlAformat).pipe(fs.createWriteStream(audioFile)) //音声ファイルを取得
              .on('finish', () => {
                console.log(`${videoID} => ${audioFile}`);
                ffmpeg() //動画と音声をマージ
                  .input(videoFile)
                  .input(audioFile)
                  .addOptions(['-c:v copy', '-c:a copy', '-map 0:v:0', '-map 1:a:0'])
                  .save(outFile)
                  .on('end', () => {
                    console.log(`Merged ${videoID}`);
                    remove(videoFile);
                    remove(audioFile);
                    fs.createReadStream(outFile)
                      .pipe(res)
                      .on('finish', () => {
                        remove(outFile);
                      });
                  });
              });
          });
      } catch(e) {
        res.status(500).send('Error');
        console.log(e);
        remove(videoFile);
        remove(audioFile);
        remove(outFile);
      }
    })();
  }
});

export default router;