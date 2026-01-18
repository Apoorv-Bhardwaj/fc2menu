import { useEffect, useState } from "react";

export default function App() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");

  function loadMenu() {
    setError("");

    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.menu);
      })
      .catch((err) => {
        console.log(err);
        setError("menu not loading :(");
      });
  }

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <h2>Mess Menu</h2>

      <button onClick={loadMenu}>Refresh</button>

      <br />
      <br />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {!menu && !error && <div>Loading bro...</div>}

      {menu && (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
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

              const b = dayData.meals?.breakfast;
              const l = dayData.meals?.lunch;
              const s = dayData.meals?.snacks;
              const d = dayData.meals?.dinner;

              return (
                <tr key={date}>
                  <td>
                    <b>{dayData.day}</b>
                    <br />
                    <small>{date}</small>
                  </td>

                  <td>{printMeal(b)}</td>
                  <td>{printMeal(l)}</td>
                  <td>{printMeal(s)}</td>
                  <td>{printMeal(d)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 20, fontSize: 12, color: "gray" }}>
        built with react 👍
      </p>
    </div>
  );
}

function printMeal(meal) {
  if (!meal) return "-";

  return (
    <div>
      <b>{meal.name}</b>
      <br />
      <small>
        {meal.startTime} - {meal.endTime}
      </small>

      <ul>
        {meal.items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
