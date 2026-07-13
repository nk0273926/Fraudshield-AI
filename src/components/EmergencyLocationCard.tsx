import { useState } from "react";
import {
  Shield,
  Phone,
  MapPin,
  Navigation,
  Search,
  Loader2,
} from "lucide-react";

export default function EmergencyLocationCard() {
  const [loading, setLoading] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const findNearby = () => {
    setMessage("");
setShowCityInput(false);
    setLoading(true);

    if (!navigator.geolocation) {
      setLoading(false);
      setShowCityInput(true);
      return;
    }

 navigator.geolocation.getCurrentPosition(
  () => {
    setLoading(false);
    setShowCityInput(false);

    window.open(
      "https://www.google.com/maps/search/Cyber+Crime+Police+Station+near+me",
      "_blank"
    );
  },
      () => {
        setLoading(false);
        setMessage("Location permission denied. Please search by city.");
        setShowCityInput(true);
      }
    );
  };

  const searchCity = () => {
    if (!city.trim()) {
      alert("Please enter your city.");
      return;
    }
setMessage(`Searching Cyber Crime Police Stations in ${city}...`);
    window.open(
      `https://www.google.com/maps/search/Cyber+Crime+Police+Station+in+${encodeURIComponent(
        city
      )}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">

      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-teal-600" />
        <h3 className="font-bold text-slate-800 text-lg">
          Need Emergency Help?
        </h3>
      </div>

      <p className="text-slate-600 text-sm mb-5">
        Locate your nearest Cyber Crime Police Station or contact the
        national cybercrime helpline immediately.
      </p>

      <div className="space-y-3">

        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="w-5 h-5 text-teal-600" />
          <span>Helpline: <strong>1930</strong></span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-5 h-5 text-teal-600" />
          <span>Find Nearest Cyber Crime Cell</span>
        </div>

      </div>

      <button
        onClick={findNearby}
        className="mt-5 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Locating...
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5" />
            Find Near Me
          </>
        )}
      </button>

      {showCityInput && (

        <div className="mt-5 space-y-3">

          <input
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-teal-600"
          />

          <button
            onClick={searchCity}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg flex justify-center items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search by City
          </button>

        </div>

      )}
{message && showCityInput && (
  <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 p-3 text-sm text-teal-700">
    {message}
  </div>
)}
      <p className="text-xs text-slate-500 mt-5">
        Report cyber fraud immediately to improve the chances of fund recovery.
      </p>

    </div>
  );
}