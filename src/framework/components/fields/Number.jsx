import React from 'react';
import Text from './Text';

//AJUSTAR AQUI!!!
const getNumber = (str, defaultValue = "0", decimalPlaces = 2) => {
    let defaultReturn, strValeu;
    strValeu = `${str}`;

    try {
        defaultReturn = Number(number.toFixed(decimalPlaces));
    } catch (e) {
        defaultReturn = "";
    }

    try {
        // Check if input is valid
        if (!strValeu) {
            return defaultReturn;
        }

        // Remove any whitespace and normalize separators
        let cleanedStr = strValeu.trim()
            .replace(/\./g, '') // Remove thousand separators
            .replace(',', '.'); // Convert decimal separator to dot

        // Parse to number
        const number = parseFloat(cleanedStr);

        // Check if parsing resulted in a valid number
        if (isNaN(number)) {
            return defaultReturn;
        }

        // Return formatted number with specified decimal places
        return Number(number.toFixed(decimalPlaces));
    } catch (error) {
        return defaultReturn;
    }
}

const Number = ({ value }) => {
    const number = getNumber(value);
    < Text value={number} />
}

export default Number;