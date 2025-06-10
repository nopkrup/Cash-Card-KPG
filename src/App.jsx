
import { useState } from "react";

export default function App() {
  const [price, setPrice] = useState(0);
  const [result, setResult] = useState(null);

  const cardOptions = [
    { price: 100000, value: 130000 },
    { price: 50000, value: 65000 },
    { price: 30000, value: 39000 },
    { price: 20000, value: 26000 },
    { price: 10000, value: 13000 },
    { price: 5000, value: 6500 },
  ];

  const calculate = () => {
    let remaining = price;
    const cardsUsed = [];
    let totalValue = 0;
    let totalPaid = 0;

    for (const card of cardOptions) {
      const count = Math.floor(remaining / card.value);
      if (count > 0) {
        cardsUsed.push({ ...card, count });
        totalValue += card.value * count;
        totalPaid += card.price * count;
        remaining -= card.value * count;
      }
    }

    const cashGap = price - totalValue;
    const totalToPay = totalPaid + cashGap;
    const discountAmount = price - totalToPay;
    const discountPercent = ((discountAmount / price) * 100).toFixed(2);

    let nextBestOptionCards = [];
    let remaining2 = price;
    let totalValue2 = 0;
    let totalPaid2 = 0;
    for (const card of cardOptions) {
      const count = Math.floor((price + card.value - totalValue) / card.value);
      if (count > 0) {
        nextBestOptionCards.push({ ...card, count });
        totalValue2 += card.value * count;
        totalPaid2 += card.price * count;
        remaining2 -= card.value * count;
      }
    }
    const totalToPay2 = totalPaid2 + (price - totalValue2);
    const discountAmount2 = price - totalToPay2;
    const discountPercent2 = ((discountAmount2 / price) * 100).toFixed(2);
    const cashGap2 = price - totalValue2;

    setResult({
      cardsUsed,
      totalValue,
      totalPaid,
      cashGap,
      totalToPay,
      discountAmount,
      discountPercent,
      suggestPurchase: price - totalValue,
      remainingCashCardValue: totalValue2 - price,
      nextBestOptionCards,
      totalValue2,
      totalPaid2,
      totalToPay2,
      discountAmount2,
      discountPercent2,
      cashGap2
    });
  };

  return (
    <div className="min-h-screen bg-blue-900 p-4 text-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 text-gray-800">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">เครื่องคำนวณการซื้อ Cash Card</h1>
        <input
          type="number"
          placeholder="กรอกราคาสินค้า (บาท)"
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
        />
        <button
          onClick={calculate}
          className="w-full bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 py-2 rounded-md"
        >
          คำนวณ
        </button>

        {result && (
          <div>
            <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-800 mb-2">🅰️ ตัวเลือก A: ใช้บัตรเท่าที่จำเป็น</h2>
              <p className="text-blue-900 font-semibold">ต้องใช้บัตร Cash Card ดังนี้:</p>
              <ul className="list-disc list-inside mb-2">
                {result.cardsUsed.map((card, idx) => (
                  <li key={idx}>
                    บัตรมูลค่า {card.price.toLocaleString()} บาท × {card.count} ใบ (ได้รับ {card.value.toLocaleString()} บาท/ใบ)
                  </li>
                ))}
              </ul>
              <p>มูลค่า Cash Card รวม: {result.totalValue.toLocaleString()} บาท</p>
              <p className="mt-2 font-semibold text-blue-800">💳 ชำระเงินครั้งที่ 1: ค่าบัตร Cash Card จำนวน {result.totalPaid.toLocaleString()} บาท</p>
              <p className="font-semibold text-blue-800">💸 ชำระเงินครั้งที่ 2: ส่วนต่างจากมูลค่า Cash Card จำนวน {result.cashGap.toLocaleString()} บาท</p>
              <p className="font-bold text-red-600 text-xl mt-2">💰 รวมลูกค้าต้องจ่ายทั้งหมด: {result.totalToPay.toLocaleString()} บาท</p>
              <p className="text-green-600 font-bold mt-2">ส่วนลดที่ได้รับ: {result.discountAmount.toLocaleString()} บาท ({result.discountPercent}%)</p>
            </div>

            <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-100">
              <h2 className="text-xl font-bold text-blue-800 mb-2">🅱️ ตัวเลือก B: ซื้อเพิ่มเพื่อใช้บัตรให้คุ้มค่า</h2>
              <p className="text-blue-900 font-semibold">ต้องใช้บัตร Cash Card ดังนี้:</p>
              <ul className="list-disc list-inside mb-2">
                {result.nextBestOptionCards.map((card, idx) => (
                  <li key={idx}>
                    บัตรมูลค่า {card.price.toLocaleString()} บาท × {card.count} ใบ (ได้รับ {card.value.toLocaleString()} บาท/ใบ)
                  </li>
                ))}
              </ul>
              <p>มูลค่า Cash Card รวม: {result.totalValue2.toLocaleString()} บาท</p>
              <p className="mt-2 font-semibold text-blue-800">💳 ชำระเงินครั้งที่ 1: ค่าบัตร Cash Card จำนวน {result.totalPaid2.toLocaleString()} บาท</p>
              <p className="font-semibold text-blue-800">💸 ชำระเงินครั้งที่ 2: ส่วนต่างจากมูลค่า Cash Card จำนวน {result.cashGap2.toLocaleString()} บาท</p>
              <p className="font-bold text-red-600 text-xl mt-2">💰 รวมลูกค้าต้องจ่ายทั้งหมด: {result.totalToPay2.toLocaleString()} บาท</p>
              <p className="text-green-600 font-bold mt-2">ส่วนลดที่ได้รับ: {result.discountAmount2.toLocaleString()} บาท ({result.discountPercent2}%)</p>
              <p className="text-blue-700 font-semibold">มูลค่า Cash Card คงเหลือ: {result.remainingCashCardValue.toLocaleString()} บาท</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
