
const crc = require('./crc');
const { getTag, getSubTag } = require('./scheme');

const validate = (text) => {
    try {
        const data = text.substring(0, text.length - 4);
        const checksum = text.substring(text.length - 4).toUpperCase();
        const hash = crc.computeCRC(data);

        return hash === checksum;
    } catch (error) {
        return error.message
    }
};
const crcValidate = (text) => {
    try {
        if (text.length >= 4) {
            const data = text.substring(0, text.length - 4);
            const checksum = text.substring(text.length - 4).toUpperCase();
            const hash = crc.computeCRC(data);
            return {
                result: hash === checksum,
                checksum: checksum,
                hash: hash,
                message: 'success'
            };
        } else {
            return {
                result: false,
                checksum: undefined,
                hash: undefined,
                message: 'error'
            };
        }
    } catch (error) {
        return error.message
    }

};

const readSub = (text, describe, tagId) => {
    try {
        const id = text.substring(0, 2);
        const len = parseInt(text.substring(2, 4));
        let data = text.substring(4, len + 4);
        const next = text.substring(len + 4);

        const subtag = getSubTag(tagId, id);
        if (describe) {
            value = {
                id,
                name: subtag ? subtag.name : 'N/A',
                len,
                data
            };
        } else {
            value = data
        }

        if (next.length) {
            return {
                [id]: value,
                ...readSub(next, describe, tagId)
            };
        } else {
            return {
                [id]: value
            };
        }
    } catch (error) {
        return error.message
    }

};


const read = (text, describe) => {
    try {
        let subdata = {}
        const id = text.substring(0, 2);
        const len = parseInt(text.substring(2, 4));
        let data = text.substring(4, len + 4);
        const next = text.substring(len + 4);

        const tag = getTag(id);
        const pare_id = parseInt(id);
        if (pare_id >= 2 && pare_id <= 51 || pare_id === 62) {
            subdata = readSub(data, describe, id);
            data = subdata

        }
        if (describe) {
            value = {
                id,
                name: tag ? tag.name : 'N/A',
                len,
                data
            };
        } else {
            value = data
        }
        if (next.length) {
            return {
                [id]: value,
                ...read(next, describe)
            };
        } else {
            return {
                [id]: value
            };
        }
    } catch (error) {
        return error.message
    }
};

const decode = (text, tiny = false) => {
    try {
        // if (!validate(text)) {
        //     // throw new Error('Checksum validation failed.');
        //     return { result: 'Error', message: 'Checksum validation failed.' };
        // }
        const data = read(text, !tiny)
        // console.log('data')
        // console.log(data)
        return data;
    } catch (error) {
        return error.message
    }
};

module.exports = {
    decode,
    crcValidate
};
