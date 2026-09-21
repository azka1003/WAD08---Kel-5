const FACILITY_OPTIONS = ["AC", "WiFi", "Parkir", "Kamar Mandi Dalam", "Pantry"];
const ROOM_TYPE_OPTIONS = ["Standar", "Deluxe", "Eksklusif", "All"];

// Semua nilai & fungsi di bawah datang dari props (lifted state di SearchKost)
export default function FilterSidebar({
  selectedFacility,
  setSelectedFacility,
  selectedRoomType,
  setSelectedRoomType,
  maxPrice,
  setMaxPrice,
}) {
  const toggleFacility = (item) => {
    if (selectedFacility.includes(item)) {
      setSelectedFacility(selectedFacility.filter((f) => f !== item));
    } else {
      setSelectedFacility([...selectedFacility, item]);
    }
  };

  return (
    <aside className="w-64 self-start bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h2 className="text-gray-400 font-bold uppercase text-sm mb-5">Filter</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Fasilitas</h3>
        <div className="space-y-2 text-gray-600">
          {FACILITY_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFacility.includes(item)}
                onChange={() => toggleFacility(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Tipe Kamar</h3>
        <div className="space-y-2 text-gray-600">
          {ROOM_TYPE_OPTIONS.map((item) => {
            const value = item === "All" ? "" : item;
            return (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipe"
                  value={item}
                  checked={selectedRoomType === value}
                  onChange={(e) =>
                    setSelectedRoomType(e.target.value === "All" ? "" : e.target.value)
                  }
                  className="text-green-600 focus:ring-green-500"
                />{" "}
                {item}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Harga Maks (Rp)</h3>
        <input
          type="text"
          placeholder="cth: 2000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button
        onClick={() => {
          setSelectedFacility([]);
          setSelectedRoomType("");
          setMaxPrice("");
        }}
        className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-full transition text-sm font-medium"
      >
        Reset Filter
      </button>
    </aside>
  );
}
