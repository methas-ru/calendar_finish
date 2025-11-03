// src/AppointmentForm.jsx
import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AppointmentForm({ setShowForm }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please login first");

    await addDoc(collection(db, "appointments"), {
      name,
      date,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      color: "#4CAF50"
    });
    setName("");
    setDate("");
    // alert("Appointment added!");
    setShowForm(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Appointment Name" required />
      <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit">Add Appointment</button>
    </form>
  );
}
