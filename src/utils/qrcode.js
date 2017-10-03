import qr from 'qr-image';
import fs from 'fs';
import config from 'config';

export default () => {
  const qrPng = qr.image(config.crowdsale_address, { type: 'png' });
  qrPng.pipe(fs.createWriteStream(__dirname + '/../views/public/images/crowdsale.png'));
}
