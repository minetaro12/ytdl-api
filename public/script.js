let mp3Mode;
let avcQuery;
let aacQuery;

const submitButton = document.getElementById('submitButton');
const statusArea = document.getElementById('statusArea');
const urlText = document.getElementById('downloadUrl');
const avcCheck = document.getElementById('avcOption');
const aacCheck = document.getElementById('aacOption');
const mp3Check = document.getElementById('mp3Option');

const waitHtml = '<button class="btn btn-primary" type="button" disabled>\
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\
  Please Wait...\
  </button>';

const dlHtml = '<button class="btn btn-primary" type="button" disabled>\
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\
  Downloading...\
  </button>';

const defHtml = '<input type="button" value="おとす" onclick="submit()" class="btn btn-outline-primary">';

const errHtml = '<div class="alert alert-danger" role="alert">エラーが発生しました</div>';

window.onload = function() {
  mp3Mode = false;
  console.log(`mp3mode=${mp3Mode}`);
};

//MP3モード選択時に他のチェックボックスをグレーアウト
const valueChange = function() {
  if(mp3Check.checked) {
    avcCheck.checked = false;
    avcCheck.disabled = true;
    aacCheck.checked = false;
    aacCheck.disabled = true;
    mp3Mode = true;
  } else {
    avcCheck.disabled = false;
    aacCheck.disabled = false;
    mp3Mode = false;
  };
  console.log(`mp3mode=${mp3Mode}`);
};

//ダウンロード処理
const submit = function() {
  statusArea.innerHTML = '';

  //何も入力されていない場合
  if(!urlText.value) {
    statusArea.innerHTML = '<div class="alert alert-warning" role="alert">URLを入力してください</div>';
    return;
  };

  const videoId = urlText.value

  if(avcCheck.checked == true) {
    avcQuery = '&avc=1';
  } else {
    avcQuery = '&avc=0';
  };

  if(aacCheck.checked == true) {
    aacQuery = '&aac=1';
  } else {
    aacQuery = '&aac=0';
  };

  let fileName;
  if(mp3Mode == true) {
    submitButton.innerHTML = waitHtml;
    fetch(`/mp3?url=${videoId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error;
      };
      submitButton.innerHTML = dlHtml;
      const header = res.headers.get('Content-Disposition');
      const parts = header.split(';');
      fileName = decodeURIComponent(parts[1].split('=')[1]);
      console.log(fileName)
      return res.blob();
    })
    .then((data) => {
      submitButton.innerHTML = defHtml;
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = fileName;
      a.click();
      a.remove();
    })
    .catch((error) => {
      submitButton.innerHTML = defHtml;
      statusArea.innerHTML = errHtml;
      return;
    });
  };

  if(mp3Mode == false) {
    submitButton.innerHTML = waitHtml;
    fetch(`/download?url=${videoId}${avcQuery}${aacQuery}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error;
      };
      submitButton.innerHTML = dlHtml;
      const header = res.headers.get('Content-Disposition');
      const parts = header.split(';');
      fileName = decodeURIComponent(parts[1].split('=')[1]);
      console.log(fileName)
      return res.blob();
    })
    .then((data) => {
      submitButton.innerHTML = defHtml;
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = fileName;
      a.click();
      a.remove();
    })
    .catch((error) => {
      submitButton.innerHTML = defHtml;
      statusArea.innerHTML = errHtml;
      return;
    });
  };
};
