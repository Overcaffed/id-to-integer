enum EphType {
    work = 1,
    manifestation,
    product,
}

// We're only ever dealing with double digits
function zeroPad(code: number): string {
    return ('0' + String(code)).slice(-2);
}

export function encode(input: string): number {
    if (input.indexOf('EPR-') !== 0) {
        throw new Error('Not a valid EPH ID');
    }

    // Break down the type of id to a single digit to keep the numbers small(er)
    let identifierDigit: number;

    if (input.includes('-W-')) {
        identifierDigit = EphType.work;
    } else if (input.includes('-M-')) {
        identifierDigit = EphType.manifestation;
    } else {
        identifierDigit = EphType.product;
    }

    const encodedNumberPairs = input
        // EPR and type are redundant
        .replace(/^EPR\-([W|M]\-)?/, '')
        .split('')
        .map((char) => zeroPad(char.charCodeAt(0)))
        .join('');
    // Add a leading digit- acts as identifier and first "actual" digit could be a loseable 0
    return parseInt(identifierDigit + encodedNumberPairs, 10);
}

export function decode(input: number): string {
    if (!input || isNaN(input)) {
        throw new Error('Invalid input');
    }
    const stringInput = String(input);
    const identifierDigit = parseInt(stringInput[0], 10);

    // Get ID type
    let idPrefix: string;
    switch (identifierDigit) {
        case EphType.work:
            idPrefix = 'EPR-W-';
            break;
        case EphType.manifestation:
            idPrefix = 'EPR-M-';
            break;
        default:
            idPrefix = 'EPR-';
    }

    const decodedChars = stringInput
        // Strip away the leading identifier digit
        .substring(1)
        // "Split" into pairs of digits
        .match(/(..?)/g)!
        .map((code) => String.fromCharCode(parseInt(code, 10)))
        .join('');

    return idPrefix + decodedChars;
}
