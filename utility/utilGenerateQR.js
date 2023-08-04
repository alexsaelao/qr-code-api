const fs = require('fs');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

exports.generatePngQR = async (playload, fileName, filePath, size = 400, ecl = 'H') => {
    size = parseInt(size)
    const result = new Promise((resolve, reject) => {
        QRCode.toFile(
            `${filePath}/${fileName}`,
            [{ data: playload }],
            { width: size, margin: 0.5, type: 'image/png', errorCorrectionLevel: ecl }, function (err, url) {
                if (err) {
                    return reject(err);
                };
                return resolve(url);
            });
    });
    console.log(`Saved File to ${filePath}/${fileName} !!!`);
    return result;
}
exports.generateSvgQR = async (playload, size = 400, ecl = 'H') => {
    size = parseInt(size)
    const result = new Promise((resolve, reject) => {
        QRCode.toString(playload, { type: 'svg', width: size, margin: 0.5, errorCorrectionLevel: ecl }, function (err, url) {
            if (err) {
                reject(err);
            };
            resolve(url);
        });
    });
    return result;
}

exports.generateBase64Qr = async (playload, size = 400, ecl = 'H') => {
    size = parseInt(size);
    const result = new Promise((resolve, reject) => {
        QRCode.toDataURL(playload, { width: size, margin: 0.5, errorCorrectionLevel: ecl }, function (err, url) {
            if (err) {
                reject(err);
            };
            resolve(url);
        })
    });
    return result;
}
exports.generateBase64QrWithLogo = async (playload, logoPath, size = 400, logoSize, ecl = 'H') => {
    size = parseInt(size)
    cwidth = size / 4;
    const canvasQR = createCanvas(size, size);
    const url = QRCode.toCanvas(canvasQR, playload, {
        width: size,
        errorCorrectionLevel: ecl,
        margin: 0.5,
        color: {
            dark: '#000000',	// black pixels
            light: '#ffffff',	// white background
        }
    });
    const ctx = canvasQR.getContext("2d");
    const img = await loadImage(logoPath);
    const center = (size - logoSize) / 2;
    ctx.drawImage(img, center, center, logoSize, logoSize);
    return canvasQR.toDataURL("image/png");
}


exports.base64ToImage = async (base64Data, fileName, filePath) => {
    const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buf = await new Buffer.from(data, 'base64');
    fs.writeFileSync(`${filePath}/${fileName}`, buf)
    
    console.log(`Saved File to ${filePath}/${fileName} !!!`);
    return true
}