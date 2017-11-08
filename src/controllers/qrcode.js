import qr from 'qr-image';

export default async (req, res) => {
  const code = qr.image(req.params.address, { type: 'png' });
  res.setHeader('Content-type', 'image/png');
  code.pipe(res);
};
