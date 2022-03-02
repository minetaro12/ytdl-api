const port = process.env.PORT || 8000;
import express from 'express';
const app = express();
import fs from 'fs';

//tmpディレクトリの作成
try {
  fs.mkdirSync('tmp');
} catch(e) {
  console.log('Skip mkdir');
};

app.use(express.urlencoded({extended: true}));

import htmlClient from './client';
app.use('/', htmlClient);

import downlaodProcess from './download';
app.use('/download', downlaodProcess);

import mp3Process from './mp3';
app.use('/mp3', mp3Process);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});