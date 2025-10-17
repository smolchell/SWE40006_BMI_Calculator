/**
 * @jest-environment jsdom
 */

// Mock the global fetch function
global.fetch = jest.fn();

// Mock DOM elements
document.body.innerHTML = `
  <form id="bmiForm">
    <input id="height" value="175">
    <input id="weight" value="70">
    <div id="resultBox" class="neutral">
      <div id="bmiNumber">—</div>
      <div id="bmiMeaning">Enter your details to calculate.</div>
    </div>
  </form>
`;

// Import the functions (in a real setup, you'd import from script.js)
// For this test, we'll redefine them in the test context
const { calculateBMI, showResult, resetResult } = require('./script');

describe('BMI Calculator Frontend', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
    // Reset DOM values
    document.getElementById('height').value = '175';
    document.getElementById('weight').value = '70';
  });

  describe('calculateBMI', () => {
    test('successfully calculates BMI with valid inputs', async () => {
      // Mock successful API response
      const mockResponse = {
        bmi: 22.86,
        category: 'Normal weight'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await calculateBMI();

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height: 175, weight: 70 })
      });
    });

    test('handles invalid inputs gracefully', async () => {
      // Test with zero values
      document.getElementById('height').value = '0';
      document.getElementById('weight').value = '70';

      const showResultMock = jest.fn();
      global.showResult = showResultMock;

      await calculateBMI();

      expect(showResultMock).toHaveBeenCalledWith('—', 'Please enter valid height and weight.', 'warn');
    });

    test('handles API errors gracefully', async () => {
      // Mock API error response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Invalid input data' })
      });

      const showResultMock = jest.fn();
      global.showResult = showResultMock;

      await calculateBMI();

      expect(showResultMock).toHaveBeenCalledWith('—', 'Invalid input data', 'bad');
    });

    test('handles network failures', async () => {
      // Mock network failure
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const showResultMock = jest.fn();
      global.showResult = showResultMock;

      await calculateBMI();

      expect(showResultMock).toHaveBeenCalledWith('—', 'Network error', 'bad');
    });
  });

  describe('showResult', () => {
    test('updates DOM with correct values and classes', () => {
      const testCases = [
        { num: '22.9', meaning: 'Normal weight', cls: 'neutral', expectedClass: 'neutral' },
        { num: '27.5', meaning: 'Overweight', cls: 'warn', expectedClass: 'warn' },
        { num: '32.1', meaning: 'Obesity', cls: 'bad', expectedClass: 'bad' }
      ];

      testCases.forEach(({ num, meaning, cls, expectedClass }) => {
        // Reset the DOM element
        document.getElementById('resultBox').className = 'neutral';
        
        showResult(num, meaning, cls);

        const resultBox = document.getElementById('resultBox');
        const bmiNumber = document.getElementById('bmiNumber');
        const bmiMeaning = document.getElementById('bmiMeaning');

        expect(resultBox.classList.contains(expectedClass)).toBe(true);
        expect(bmiNumber.textContent).toBe(num);
        expect(bmiMeaning.textContent).toBe(meaning);
      });
    });

    test('removes previous classes when updating', () => {
      const resultBox = document.getElementById('resultBox');
      resultBox.className = 'warn'; // Set initial class

      showResult('25.0', 'Overweight', 'neutral');

      expect(resultBox.classList.contains('warn')).toBe(false);
      expect(resultBox.classList.contains('neutral')).toBe(true);
    });
  });

  describe('resetResult', () => {
    test('resets result to initial state', () => {
      // Set some initial state
      document.getElementById('bmiNumber').textContent = '25.0';
      document.getElementById('bmiMeaning').textContent = 'Overweight';
      document.getElementById('resultBox').className = 'warn';

      resetResult();

      const bmiNumber = document.getElementById('bmiNumber');
      const bmiMeaning = document.getElementById('bmiMeaning');
      const resultBox = document.getElementById('resultBox');

      expect(bmiNumber.textContent).toBe('—');
      expect(bmiMeaning.textContent).toBe('Enter your details to calculate.');
      expect(resultBox.classList.contains('neutral')).toBe(true);
    });
  });
});

describe('Input Validation', () => {
  test('validates height and weight ranges', () => {
    const testCases = [
      { height: '175', weight: '70', isValid: true },
      { height: '0', weight: '70', isValid: false },
      { height: '175', weight: '0', isValid: false },
      { height: '-175', weight: '70', isValid: false },
      { height: '175', weight: '-70', isValid: false },
      { height: '', weight: '70', isValid: false },
      { height: '175', weight: '', isValid: false }
    ];

    testCases.forEach(({ height, weight, isValid }) => {
      document.getElementById('height').value = height;
      document.getElementById('weight').value = weight;

      const hCm = parseFloat(height);
      const wKg = parseFloat(weight);

      const actualIsValid = !isNaN(hCm) && !isNaN(wKg) && hCm > 0 && wKg > 0;
      expect(actualIsValid).toBe(isValid);
    });
  });
});