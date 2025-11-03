import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}
function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function monthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function Calendar({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    try {
      const q = query(collection(db, "appointments"), where("userId", "==", user.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data || []);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const ok = window.confirm("Delete this appointment?");
      if (!ok) return;
      await deleteDoc(doc(db, "appointments", id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert("Failed to delete appointment.");
    }
  };

  const handleColorChange = async (id, newColor) => {
    try {
      await updateDoc(doc(db, "appointments", id), { color: newColor });
    } catch (err) {
      console.error("Error updating color:", err);
      alert("Failed to change color.");
    }
  };

  const start = monthStart(currentMonth);
  const end = monthEnd(currentMonth);
  const firstDayOfWeek = start.getDay();
  const daysInMonth = end.getDate();

  const weeks = [];
  let dayCounter = 1 - firstDayOfWeek;
  while (dayCounter <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++, dayCounter++) {
      week.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayCounter));
    }
    weeks.push(week);
  }

  const today = new Date();

  return (
    <div className="calendar-container">
      <div className="cal-header">
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>⬅️</button>
        <div className="month-title">
          {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>➡️</button>
      </div>

      <div className="cal-grid">
        <div className="week-days">
          {WEEK_DAYS.map((w) => (
            <div key={w} className="week-day">
              {w}
            </div>
          ))}
        </div>

        <div className="weeks">
          {weeks.map((week, wi) => (
            <div className="week-row" key={wi}>
              {week.map((d, di) => {
                const muted = d.getMonth() !== currentMonth.getMonth();
                const isToday =
                  d.getFullYear() === today.getFullYear() &&
                  d.getMonth() === today.getMonth() &&
                  d.getDate() === today.getDate();

                const dayAppointments = appointments
                  .filter((a) => {
                    try {
                      return new Date(a.date).toDateString() === d.toDateString();
                    } catch {
                      return false;
                    }
                  })
                  .sort((a, b) => new Date(a.date) - new Date(b.date));

                return (
                  <div
                    key={di}
                    className={`day-cell ${muted ? "muted" : ""} ${isToday ? "today" : ""}`}
                  >
                    <div className="day-number">{d.getDate()}</div>
                    <div className="appointments">
                      {dayAppointments.map((a) => {
                        let time = "";
                        try {
                          time = new Date(a.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        } catch {
                          time = "??:??";
                        }

                        return (
                          <div
                            key={a.id}
                            className="appointment-item"
                            style={{
                              backgroundColor: a.color || "#4CAF50",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              marginTop: "2px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontSize: "12px",
                            }}
                          >
                            <span>
                              {time}   {a.name || "Untitled"}
                            </span>
                            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                              <input
                                type="color"
                                value={a.color || "#4CAF50"}
                                onChange={(e) => handleColorChange(a.id, e.target.value)}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                }}
                              />
                              <button
                                onClick={() => handleDelete(a.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "white",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                x
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}