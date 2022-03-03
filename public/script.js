let mp3Mode;
let avcQuery;
let aacQuery;
const statusText = document.getElementById('status');
const urlText = document.getElementById('downloadUrl');
const avcCheck = document.getElementById('avcOption');
const aacCheck = document.getElementById('aacOption');
const mp3Check = document.getElementById('mp3Option');

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
  //何も入力されていない場合
  if(!urlText.value) {
    alert('URLを入力してください');
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
    statusText.innerHTML = '<p>Please Wait...<img src="https://www.benricho.org/loading_images/img-transparent/712-24.gif"></p>';
    fetch(`/mp3?url=${videoId}`)
    .then((res) => {
      if (!res.ok) {
        statusText.innerHTML = '<p>Error</p>';
        return;
      };
      statusText.innerHTML = '<p>Downloading...<img src="https://www.benricho.org/loading_images/img-transparent/712-24.gif"></p>';
      const header = res.headers.get('Content-Disposition');
      const parts = header.split(';');
      fileName = decodeURIComponent(parts[1].split('=')[1]);
      console.log(fileName)
      return res.blob();
    })
    .then((data) => {
      statusText.innerHTML = '<p>Complete!</p>';
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = fileName;
      a.click();
      a.remove();
    })
    .catch((error) => {
      statusText.innerHTML = '<p>Error</p>';
      return;
    });
    return;
  };

  if(mp3Mode == false) {
    statusText.innerHTML = '<p>Please Wait...<img src="https://www.benricho.org/loading_images/img-transparent/712-24.gif"></p>';
    fetch(`/download?url=${videoId}${avcQuery}${aacQuery}`)
    .then((res) => {
      if (!res.ok) {
        statusText.innerHTML = '<p>Error</p>';
        return;
      };
      statusText.innerHTML = '<p>Downloading...<img src="https://www.benricho.org/loading_images/img-transparent/712-24.gif"></p>';
      const header = res.headers.get('Content-Disposition');
      const parts = header.split(';');
      fileName = decodeURIComponent(parts[1].split('=')[1]);
      console.log(fileName)
      return res.blob();
    })
    .then((data) => {
      statusText.innerHTML = '<p>Complete!</p>';
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = fileName;
      a.click();
      a.remove();
    })
    .catch((error) => {
      statusText.innerHTML = '<p>Error</p>';
      return;
    });
    return;
  };
};
