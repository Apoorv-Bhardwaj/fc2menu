import { useEffect, useState } from "react";

export default function App() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  function loadMenu() {
    setError("");
    setDebug("Fetching from: /api/menu...");

    fetch("/api/menu")
      .then((res) => {
        // Step 1: Check if the server even responded
        setDebug(`Server responded with Status: ${res.status} (${res.statusText})`);
        
        if (!res.ok) {
          throw new Error(`Server Error: ${res.status}. Check if your proxy is running.`);
        }
        return res.json();
      })
      .then((data) => {
        // Step 2: Check if the JSON structure is what we expect
        if (data && data.menu) {
          setMenu(data.menu);
          setDebug("Success: Data loaded.");
        } else {
          console.log("Received data:", data);
          throw new Error("JSON received, but 'menu' field is missing. Check API response.");
        }
      })
      .catch((err) => {
        // Step 3: Catch Network/CORS/DNS errors
        console.error("Full Error:", err);
        setError(`${err.message}`);
        setDebug(`Failed. Likely causes: 1. Firewall blocking phone. 2. Vite Proxy not configured. 3. Not on same Wi-Fi.`);
      });
  }

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div style={{ padding: 15, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 5 }}>Mess Menu 🍴</h2>
      <button 
        onClick={loadMenu} 
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Refresh Menu
      </button>

      <div style={{ marginTop: 20 }}>
        {/* Error Box */}
        {error && (
          <div style={{ padding: 10, backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #c62828', borderRadius: 5, marginBottom: 10 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Debug Info Box */}
        <div style={{ padding: 10, backgroundColor: '#f5f5f5', fontSize: '12px', borderRadius: 5, border: '1px solid #ddd', marginBottom: 20 }}>
          <strong>Debug Log:</strong> {debug}
        </div>

        {!menu && !error && <div>Loading menu, please wait...</div>}

        {menu && (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Snacks</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(menu).map((date) => {
                const dayData = menu[date];
                return (
                  <tr key={date}>
                    <td style={{ textAlign: 'center' }}>
                      <strong>{dayData.day}</strong><br />
                      <small style={{ color: '#666' }}>{date}</small>
                    </td>
                    <td>{printMeal(dayData.meals?.breakfast)}</td>
                    <td>{printMeal(dayData.meals?.lunch)}</td>
                    <td>{printMeal(dayData.meals?.snacks)}</td>
                    <td>{printMeal(dayData.meals?.dinner)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ marginTop: 30, fontSize: 11, color: "gray" }}>
        React App • Build: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

function printMeal(meal) {
  if (!meal || !meal.items || meal.items.length === 0) return "-";
  return (
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{meal.name}</div>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: 5 }}>
        {meal.startTime} - {meal.endTime}
      </div>
      <ul style={{ paddingLeft: 15, margin: 0, fontSize: '13px' }}>
        {meal.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}