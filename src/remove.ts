import fs from 'fs';

const remove = function(file: string) {
  try {
    if(fs.existsSync(file)) { //存在の確認
      fs.unlinkSync(file);
      console.log(`Removed: ${file}`);
    } else {
      console.log(`Skip: ${file}`);
    };
  } catch(e) {
    console.log('Remove Error');
  };
};

export default remove;