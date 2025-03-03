import Image from "next/image";
import styles from "./page.module.css";
import "globals.css";
import Navbar from "./components/Navbar";
import ParticipantsTable from "./components/ParticipantsTable";


export default function Home() {
  return (
    <div>
        <Navbar />
        <ParticipantsTable />
    </div>
  );
}
