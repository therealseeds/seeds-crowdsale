import qr from 'qr-image';
import fs from 'fs';

export default (address) => {
  const qrPng = qr.image(address, { type: 'png' });
  qrPng.pipe(fs.createWriteStream(__dirname + '/../views/public/images/crowdsale.png'));
}
