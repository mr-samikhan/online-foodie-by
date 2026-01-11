// import { useMenu } from "@/hooks/useMenu";
// import { useInvoice } from "@/store/InvoiceContext";
// import { useState } from "react";

// export default function ServicesView() {
//   const { menu } = useMenu();
//   const { addItem } = useInvoice();
//   const [selectedCat, setSelectedCat] = useState(null);

//   return (
//     <div className="flex h-full">
//       {/* Categories */}
//       <div className="w-1/2 border-r p-4">
//         <h3 className="font-bold mb-3">Categories</h3>
//         {Object.keys(menu).map((cat) => (
//           <div
//             key={cat}
//             onClick={() => setSelectedCat(cat)}
//             className="p-3 bg-gray-100 mb-2 cursor-pointer"
//           >
//             {cat}
//           </div>
//         ))}
//       </div>

//       {/* Items */}
//       <div className="w-1/2 p-4">
//         <h3 className="font-bold mb-3">{selectedCat}</h3>

//         {selectedCat &&
//           Object.entries(menu[selectedCat]).map(([item, price]) => (
//             <div
//               key={item}
//               onClick={() =>
//                 addItem({
//                   name: `${selectedCat} - ${item}`,
//                   price,
//                 })
//               }
//               className="p-3 bg-green-100 mb-2 cursor-pointer flex justify-between"
//             >
//               <span>{item}</span>
//               <span>Rs {price}</span>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useMenu } from "@/hooks/useMenu";
import { useInvoice } from "@/store/InvoiceContext";
import { useState } from "react";

const categoryIcons = {
  Karahi: "🍛",
  BBQ: "🔥",
  Burger: "🍔",
  Drinks: "🥤",
  Rice: "🍚",
};

export default function ServicesView() {
  const { menu } = useMenu();
  const { addItem } = useInvoice();
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full bg-gray-50 rounded-lg overflow-hidden shadow">
      {/* Categories */}
      <div className="w-1/3 bg-white p-4 border-r">
        <h3 className="font-bold text-lg mb-4">🍽 Categories</h3>

        <div className="space-y-2">
          {Object.keys(menu).map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition
                ${
                  selectedCat === cat
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              <span className="flex items-center gap-2">
                <span>{categoryIcons[cat] || "🍴"}</span>
                {cat}
              </span>
              <span>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="w-2/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">
            {selectedCat ? `🍛 ${selectedCat}` : "Select a category"}
          </h3>

          <input
            type="text"
            placeholder="Search item..."
            className="border px-3 py-2 rounded-lg w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedCat && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(menu[selectedCat])
              .filter(([item]) =>
                item.toLowerCase().includes(search.toLowerCase())
              )
              .map(([item, price]) => (
                <div
                  key={item}
                  onClick={() =>
                    addItem({
                      name: `${selectedCat} - ${item}`,
                      price,
                    })
                  }
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition flex flex-col justify-between"
                >
                  <p className="font-semibold text-gray-800">{item}</p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-600 font-bold">Rs {price}</span>

                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      Add +
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
