import { useState, useEffect } from "react";
import Login from "./login";
import AppointmentForm from "./AppointmentForm";

import AppointmentList from "./AppointmentList";
import Calendar from "./Calendar"; 
import { auth } from "./firebase";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <h1>Golf Calendar</h1>
      <Login setUser={setUser} />
      {user && (
        <>
          {showForm && <AppointmentForm user={user} setShowForm={setShowForm} />}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add Appointment"}
          </button>
          {/* <AppointmentList user={user} /> */}
          <Calendar user={user} />
        </>
      )}
    </div>
  );
}

export default App;
