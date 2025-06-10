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
    let bestCombo = null;
    let maxTotalValue = 0;

    const maxCount = 10;

    const tryCombo = (combo) => {
      let totalValue = 0;
      let totalPaid = 0;
      for (let i = 0; i < combo.length; i++) {
        totalValue += cardOptions[i].value * combo[i];
        totalPaid += cardOptions[i].price * combo[i];
      }

      if (totalValue <= price && totalValue > maxTotalValue) {
        maxTotalValue = totalValue;
        bestCombo = {
          cardsUsed: combo.map((count, i) => ({ ...cardOptions[i], count })).filter(c => c.count > 0),
          totalValue,
          totalPaid,
          remaining: price - totalValue,
          discountPercent: (((totalValue - totalPaid) / totalValue) * 100).toFixed(2),
        };
      }
    };

    const recurse = (combo = [], depth = 0) => {
      if (depth === cardOptions.length) {
        tryCombo(combo);
        return;
      }
      for (let i = 0; i <= maxCount; i++) {
        recurse([...combo, i], depth + 1);
      }
    };

    recurse();
    setResult(bestCombo);
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
          <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
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
            <p className="font-semibold text-blue-800">💸 ชำระเงินครั้งที่ 2: ส่วนต่างจากมูลค่า Cash Card จำนวน {(price - result.totalValue).toLocaleString()} บาท</p>
            <p className="font-semibold text-black mt-1">💰 รวมลูกค้าต้องจ่ายทั้งหมด: {(result.totalPaid + (price - result.totalValue)).toLocaleString()} บาท</p>
            <p className="text-green-600 font-bold mt-2">ส่วนลดที่ได้รับ: {result.discountPercent}%</p>
          </div>
        )}
      </div>
    </div>
  );
}