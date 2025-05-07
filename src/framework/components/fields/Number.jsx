import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text';

const getNumber = (input, defaultValue = 0, decimalPlaces = 2, useThousandSeparator = true) => {
    // Handle null/undefined inputs
    if (input == null) {
        return Number(defaultValue.toFixed(decimalPlaces)).toLocaleString('pt-BR', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
            useGrouping: useThousandSeparator
        });
    }

    try {
        // If input is already a number and valid, format it
        if (typeof input === 'number' && !isNaN(input)) {
            return input.toLocaleString('pt-BR', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
                useGrouping: useThousandSeparator
            });
        }

        // Convert input to string for processing
        const strValue = String(input).trim();

        // Check if input is empty
        if (!strValue) {
            return Number(defaultValue.toFixed(decimalPlaces)).toLocaleString('pt-BR', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
                useGrouping: useThousandSeparator
            });
        }

        // Clean and normalize string input
        let cleanedStr = strValue
            .replace(/[^\d.,-]/g, '') // Remove non-numeric characters except dot, comma, minus
            .replace(/\.(?=.*\.)/g, '') // Remove extra dots
            .replace(',', '.'); // Convert comma to dot

        // Parse to number
        const number = parseFloat(cleanedStr);

        // Return formatted number or default if invalid
        return isNaN(number)
            ? Number(defaultValue.toFixed(decimalPlaces)).toLocaleString('pt-BR', {
                  minimumFractionDigits: decimalPlaces,
                  maximumFractionDigits: decimalPlaces,
                  useGrouping: useThousandSeparator
              })
            : number.toLocaleString('pt-BR', {
                  minimumFractionDigits: decimalPlaces,
                  maximumFractionDigits: decimalPlaces,
                  useGrouping: useThousandSeparator
              });
    } catch (error) {
        return Number(defaultValue.toFixed(decimalPlaces)).toLocaleString('pt-BR', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
            useGrouping: useThousandSeparator
        });
    }
};

const Number = ({ value, decimalPlaces, defaultValue }) => {
    const formattedNumber = getNumber(value, defaultValue, decimalPlaces);
    return <Text value={formattedNumber} />;
};

Number.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    decimalPlaces: PropTypes.number,
    defaultValue: PropTypes.number
};

export default Number;