const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/currency/rates/:baseCurrency
// @desc    Get exchange rates for a base currency
// @access  Private
router.get('/rates/:baseCurrency', protect, async (req, res) => {
  try {
    const { baseCurrency } = req.params;
    
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );

    res.json({
      base: response.data.base,
      date: response.data.date,
      rates: response.data.rates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exchange rates', error: error.message });
  }
});

// @route   GET /api/currency/countries
// @desc    Get list of countries with their currencies
// @access  Private
router.get('/countries', protect, async (req, res) => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name,currencies'
    );

    const countries = response.data.map(country => ({
      name: country.name.common,
      currencies: country.currencies,
    }));

    res.json({ countries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
  }
});

// @route   POST /api/currency/convert
// @desc    Convert amount from one currency to another
// @access  Private
router.post('/convert', protect, async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({ message: 'Please provide amount, fromCurrency, and toCurrency' });
    }

    if (fromCurrency === toCurrency) {
      return res.json({
        amount: parseFloat(amount),
        convertedAmount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        exchangeRate: 1,
      });
    }

    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );

    const rate = response.data.rates[toCurrency];
    
    if (!rate) {
      return res.status(400).json({ message: 'Currency conversion rate not found' });
    }

    const convertedAmount = parseFloat(amount) * rate;

    res.json({
      amount: parseFloat(amount),
      convertedAmount,
      fromCurrency,
      toCurrency,
      exchangeRate: rate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to convert currency', error: error.message });
  }
});

module.exports = router;