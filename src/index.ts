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

import downlaodProcess from './download';
app.use('/download', downlaodProcess);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});