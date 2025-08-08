import { useState } from "react";

export default function App() {
  // State to store the input price
  const [price, setPrice] = useState(0);
  // State to store the calculation result
  const [result, setResult] = useState(null);
  // State to manage the calculation mode: 'option1' or 'option2'
  const [calculationMode, setCalculationMode] = useState('option1'); // Default to Option 1

  // Array of available cash card options, with their price and gift card value
  // The order here doesn't strictly matter as they will be sorted by effectiveValue in calculate()
  const cardOptions = [
    { price: 100000, giftCard: 40000 },
    { price: 50000, giftCard: 20000 },
    { price: 30000, giftCard: 12000 },
    { price: 10000, giftCard: 4000 },
  ];

  // Function to calculate the optimal cash card combination based on the selected mode
  const calculate = () => {
    let remaining = price; // Initialize remaining amount to the input price
    const cardsUsed = []; // Array to store the cards used in the calculation
    let totalEffectiveValue = 0; // Total value obtained (including gift cards for option 1, or just paid amount for option 2)
    let totalPaidForCards = 0; // Total actual amount paid for cash cards
    let totalGiftCardValue = 0; // Total gift card value for Option 2

    // Determine the 'effective value' of each card based on the selected calculation mode
    const currentCardOptions = cardOptions.map(card => {
      if (calculationMode === 'option1') {
        // Option 1: Effective value is Cash Card price + Gift Card value
        return { ...card, effectiveValue: card.price + card.giftCard };
      } else {
        // Option 2: Effective value is just the Cash Card price (no gift card benefit considered for calculation)
        return { ...card, effectiveValue: card.price };
      }
    });

    // Sort card options by their effective value in descending order
    // This is crucial for the greedy algorithm to work correctly
    currentCardOptions.sort((a, b) => b.effectiveValue - a.effectiveValue);

    // Iterate through sorted card options to find the optimal combination
    for (const card of currentCardOptions) {
      // Calculate how many of the current card can be used to cover the remaining amount
      const count = Math.floor(remaining / card.effectiveValue);
      if (count > 0) {
        // If one or more cards can be used, add them to the cardsUsed array
        cardsUsed.push({ ...card, count });
        // Accumulate the total effective value and total paid for cards
        totalEffectiveValue += card.effectiveValue * count;
        totalPaidForCards += card.price * count; // Always accumulate the actual price paid for the cards
        // For Option 2, also accumulate the total gift card value
        if (calculationMode === 'option2') {
          totalGiftCardValue += card.giftCard * count;
        }
        // Subtract the value of used cards from the remaining amount
        remaining -= card.effectiveValue * count;
      }
    }

    // Calculate the cash gap (amount not covered by cash cards)
    const cashGap = price - totalEffectiveValue;
    // Calculate the total amount the customer needs to pay (actual cash paid + cash gap)
    const totalToPay = totalPaidForCards + cashGap;

    let discountPercent = 0;
    // Calculate discount percentage based on actual product price and total paid by customer
    if (calculationMode === 'option1' && price > 0) { // Ensure price is greater than 0 to avoid division by zero
      discountPercent = (((price - totalToPay) / price) * 100).toFixed(2);
    } else if (calculationMode === 'option2') {
      // For option 2, there's no "discount" in the sense of receiving extra value from gift cards
      discountPercent = 0;
    }

    // Set the result state with all calculated values
    setResult({
      cardsUsed,
      totalEffectiveValue,
      totalPaidForCards,
      cashGap,
      totalToPay,
      discountPercent,
      calculationMode, // Pass the mode to result for conditional display
      totalGiftCardValue // Pass the total gift card value for Option 2 display
    });
  };

  return (
    // Main container with responsive styling
    <div className="min-h-screen bg-blue-900 p-4 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg p-6 text-gray-800">
        {/* Title of the application */}
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">เครื่องคำนวณการซื้อ Cash Card New</h1>

        {/* Calculation Mode Selection */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">เลือกวิธีการคำนวณ:</p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="calculationMode"
                value="option1"
                checked={calculationMode === 'option1'}
                onChange={() => setCalculationMode('option1')}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-base">ตัวเลือกที่ 1: ซื้อ Cash Card และใช้ Gift Card ได้ในบิล</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="calculationMode"
                value="option2"
                checked={calculationMode === 'option2'}
                onChange={() => setCalculationMode('option2')}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-base">ตัวเลือกที่ 2: ซื้อ Cash Card จ่ายค่าสินค้าอย่างเดียวไม่รับ Gift Card</span>
            </label>
          </div>
        </div>

        {/* Input field for the product price */}
        <input
          type="number"
          placeholder="กรอกราคาสินค้า (บาท)"
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="mb-4 border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-4 py-3 w-full text-lg transition duration-200 ease-in-out"
        />
        {/* Button to trigger the calculation */}
        <button
          onClick={calculate}
          className="w-full bg-yellow-400 text-blue-900 font-bold text-lg py-3 rounded-lg shadow-md hover:bg-yellow-300 transition duration-200 ease-in-out transform hover:scale-105"
        >
          คำนวณ
        </button>

        {/* Display calculation results if available */}
        {result && (
          <div className="mt-8 border-2 border-blue-200 rounded-xl p-6 bg-blue-50 text-gray-800">
            <p className="text-blue-900 font-semibold text-xl mb-3">ต้องใช้บัตร Cash Card ดังนี้:</p>
            <ul className="list-disc list-inside mb-4 text-lg space-y-1">
              {result.cardsUsed.length > 0 ? (
                result.cardsUsed.map((card, idx) => (
                  <li key={idx}>
                    บัตรมูลค่า <span className="font-medium">{card.price.toLocaleString()}</span> บาท × <span className="font-medium">{card.count}</span> ใบ
                    {/* Conditionally display Gift Card information for Option 1 */}
                    {result.calculationMode === 'option1' && (
                      <span> (ได้รับ Gift Card <span className="font-medium">{card.giftCard.toLocaleString()}</span> บาท/ใบ)</span>
                    )}
                  </li>
                ))
              ) : (
                <li>ไม่มีการใช้ Cash Card</li> /* Message if no cash cards are used */
              )}
            </ul>
            {/* Summary of total effective value covered by cash cards */}
            <p className="text-lg mb-2">มูลค่ารวมที่ครอบคลุมโดย Cash Card: <span className="font-bold text-blue-700">{result.totalEffectiveValue.toLocaleString()}</span> บาท</p>
            {/* First payment details: actual cost of cash cards */}
            <p className="mt-4 font-semibold text-blue-800 text-lg">💳 ชำระเงินครั้งที่ 1: ค่าบัตร Cash Card จำนวน <span className="font-bold">{result.totalPaidForCards.toLocaleString()}</span> บาท</p>
            {/* Second payment details: cash gap */}
            <p className="font-semibold text-blue-800 text-lg">💸 ชำระเงินครั้งที่ 2: ส่วนต่างจากมูลค่า Cash Card จำนวน <span className="font-bold">{result.cashGap.toLocaleString()}</span> บาท</p>
            {/* Total amount the customer needs to pay */}
            <p className="font-bold text-red-600 text-2xl mt-4">💰 รวมลูกค้าต้องจ่ายทั้งหมด: <span className="text-red-700">{result.totalToPay.toLocaleString()}</span> บาท</p>
            {/* Conditionally display discount for Option 1 */}
            {result.calculationMode === 'option1' && (
              <p className="text-green-600 font-bold text-xl mt-4">ส่วนลดที่ได้รับ: <span className="text-green-700">{result.discountPercent}%</span></p>
            )}
            {/* Display Gift Card details for Option 2 */}
            {result.calculationMode === 'option2' && result.totalGiftCardValue > 0 && (
              <div className="mt-4">
                <p className="text-blue-700 font-bold text-xl">🎁 ได้รับ Gift Card รวมมูลค่า: <span className="text-blue-800">{result.totalGiftCardValue.toLocaleString()}</span> บาท</p>
                <ul className="list-disc list-inside mt-2 text-lg space-y-1">
                  {result.cardsUsed.map((card, idx) => (
                    <li key={idx}>
                      Gift Card มูลค่า <span className="font-medium">{card.giftCard.toLocaleString()}</span> บาท × <span className="font-medium">{card.count}</span> ใบ
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
