const fs = require('fs');
const sass = require('sass');
const packageImporter = require('node-sass-package-importer');

const EXPORT_DIR = 'dist';

const ENTRY_FILE = 'src/styles.scss';
const OUT_FILE = 'dist/focusoverlay.css';

const checkExportDir = () => {
  if (!fs.existsSync(EXPORT_DIR)){
    fs.mkdirSync(EXPORT_DIR);
  }
};

sass.render({
  file: ENTRY_FILE,
  importer: packageImporter(),
  outFile: OUT_FILE,
}, function(error, result) {
  if (!error) {
    checkExportDir();

    fs.writeFile(OUT_FILE, result.css, function(err) {
      if (!err) {
        console.log('CSS File created');
      } else {
        console.error(err);
      }
    });
  } else {
    console.error(error);
  }
});
