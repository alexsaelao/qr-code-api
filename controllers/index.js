const path = require('path');
const QR = require('../utility/utilGenerateQR')
const EMVQR = require('../utility/emvqr/emvqr')
const { Merchant } = require('../utility/steplix-emv-qrcps');


exports.png = async (req, res) => {
    try {
        const playload = req.query.data || 'www.lapnet.com.la';
        const ecl = req.query.ecl || 'H';
        const size = req.query.size || 400;

        const fileName = `qrcode.png`
        const filePath = 'public/images/qrcode';
        const options = {
            root: path.join(__dirname, '../public/images/qrcode/')
        };

        await QR.generatePngQR(playload, fileName, filePath, size, ecl)

        return res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                return res.send(err)
            } else {
                console.log('Sent:', fileName);
            }
        });

    } catch (error) {
        return error.message
    }
}

exports.pngWithLogo = async (req, res) => {
    try {
        const playload = req.query.data || 'www.lapnet.com.la';
        const ecl = req.query.ecl || 'H';
        const size = req.query.size || 400;
        const logoSize = size / 4;
        const fileName = `qrcode-with-logo.png`;
        const filePath = `public/images/qrcode`;
        const logoPath = './public/images/lao-qr-bg-blue.svg';
        const options = {
            root: path.join(__dirname, '../public/images/qrcode/')
        };

        const dataURL = await QR.generateBase64QrWithLogo(playload, logoPath, size, logoSize, ecl)

        await QR.base64ToImage(dataURL, fileName, filePath)

        return res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                return res.send(err)
            } else {
                console.log('Sent:', fileName);
            }
        });

    } catch (error) {
        return error.message
    }
}

exports.svg = async (req, res) => {
    try {
        const playload = req.query.data || 'www.lapnet.com.la';
        const ecl = req.query.ecl || 'H';
        const size = parseInt(req.query.size) || 400;

        const dataURL = await QR.generateSvgQR(playload, size, ecl);

        res.send(dataURL)

    } catch (error) {
        return error.message
    }
}

exports.base64 = async (req, res) => {
    try {
        const playload = req.query.data || 'www.lapnet.com.la';
        const ecl = req.query.ecl || 'H';
        const html = req.query.html;
        const size = parseInt(req.query.size) || 400;

        const dataURL = await QR.generateBase64Qr(playload, size, ecl);

        if (parseInt(html) === 1) {
            return res.send(`
            <!DOCTYPE html/>
            <html>
            <head>
                <title>qrcode</title>
            </head>
            <body>
                <img src='${dataURL}'/>
            </body>
            </html>
        `);
        } else {
            return res.send(dataURL);
        }

    } catch (error) {
        return error.message
    }
}

exports.base64WithLogo = async (req, res) => {
    try {

        const playload = req.query.data || 'www.lapnet.com.la';
        const ecl = req.query.ecl || 'H';
        const html = req.query.html;
        const size = req.query.size || 400;
        const logoSize = size / 4;
        const logoPath = './public/images/lao-qr-bg-blue.svg';

        const dataURL = await QR.generateBase64QrWithLogo(playload, logoPath, size, logoSize, ecl);

        if (parseInt(html) === 1) {
            return res.send(`
            <!DOCTYPE html/>
            <html>
            <head>
                <title>qrcode</title>
            </head>
            <body>
                <img src='${dataURL}'/>
            </body>
            </html>
        `);
        } else {
            return res.send(dataURL);
        }

    } catch (error) {
        return error.message
    }
}

exports.readEMVQR = async (req, res) => {
    try {

        const playload = req.query.data || '00020101021138580016A00526628466257701080000041802030010315I90BYP17BC295VZ53034185802LA630491B3';

        const dataEMV = await EMVQR.decode(playload);
        console.log(dataEMV)
        return res.json(dataEMV);

    } catch (error) {
        return error.message
    }
}
exports.personalQrEMVGenerate = async (req, res, next) => {
    try {

        const aid = 'A005266284662577';
        const iin = '00000418';
        const paymentType = '001';
        const receiverId = 'I90BYP17BC295VZ'
        const payloadFormatIndicator = '01';
        const pointOfInitiationMethod = '11';
        const transactionCurrency = '418';
        // const transactionAmount = '30000'
        const countryCode = 'LA';

        const merchantAccountInformation = Merchant.buildMerchantAccountInformation();

        merchantAccountInformation.setGloballyUniqueIdentifier(aid);
        merchantAccountInformation.addPaymentNetworkSpecific('01', iin);
        merchantAccountInformation.addPaymentNetworkSpecific('02', paymentType);
        merchantAccountInformation.addPaymentNetworkSpecific('03', receiverId);

        const EMVQR = Merchant.buildEMVQR()
        EMVQR.setPayloadFormatIndicator(payloadFormatIndicator)
        EMVQR.setPointOfInitiationMethod(pointOfInitiationMethod)
        EMVQR.setTransactionCurrency(transactionCurrency)
        // EMVQR.setTransactionAmount(transactionAmount)
        EMVQR.setCountryCode(countryCode)
        EMVQR.addMerchantAccountInformation('38', merchantAccountInformation);

        const playLoad = EMVQR.generatePayload()

        res.status(200).json({ playload: playLoad })

    } catch (error) {
        next(error)
    }
}

exports.merchantQrEMVGenerate = async (req, res, next) => {
    try {

        const aid = 'A005266284662577';
        const iin = '00000418';
        const paymentType = '001';
        const receiverId = 'I90BYP17BC295VZ'
        const payloadFormatIndicator = '01';
        const pointOfInitiationMethod = '002';
        const merchantCategoryCode = '5251';
        const transactionCurrency = '418';
        // const transactionAmount = '30000';
        const countryCode = 'LA';
        const merchantCity = 'Vientiane';

        const merchantAccountInformation = Merchant.buildMerchantAccountInformation();

        merchantAccountInformation.setGloballyUniqueIdentifier(aid)
        merchantAccountInformation.addPaymentNetworkSpecific('01', iin)
        merchantAccountInformation.addPaymentNetworkSpecific('02', paymentType)
        merchantAccountInformation.addPaymentNetworkSpecific('03', receiverId)

        const EMVQR = Merchant.buildEMVQR()
        EMVQR.setPayloadFormatIndicator(payloadFormatIndicator)
        EMVQR.setPointOfInitiationMethod(pointOfInitiationMethod)
        EMVQR.setMerchantCategoryCode(merchantCategoryCode)
        EMVQR.setTransactionCurrency(transactionCurrency)
        // EMVQR.setTransactionAmount(transactionAmount)
        EMVQR.setCountryCode(countryCode)
        EMVQR.setMerchantCity(merchantCity)
        EMVQR.addMerchantAccountInformation('38', merchantAccountInformation);

        const playLoad = EMVQR.generatePayload()

        res.status(200).json({ playload: playLoad })

    } catch (error) {
        next(error)
    }
}



