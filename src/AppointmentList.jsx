import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function AppointmentList({ user }) {
    const [appointments, setAppointments] = useState([]);
  
    useEffect(() => {
      if (!user) return;
  
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", user.uid)
      );
  
      const unsubscribe = onSnapshot(q, snapshot => {
        setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
  
      return unsubscribe;
    }, [user]);
  
    return (
      <ul>
        {appointments.map(a => (
          <li key={a.id}>
            {a.name} - {new Date(a.date).toLocaleString()}
          </li>
        ))}
      </ul>
    );
  }
  