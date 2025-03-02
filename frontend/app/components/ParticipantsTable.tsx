"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableContainer,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ParticipantsTable.module.css";
import Navbar from "./Navbar";

interface Diagnosis {
  icdCode: string;
  timestamp: string;
}

interface Participant {
  firstName: string;
  lastName: string;
  diagnoses: Diagnosis[];
}

const API_URL = "http://localhost:5001/participants";
const ICD_API_URL = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search";

const ParticipantsTable: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [icdDescriptions, setIcdDescriptions] = useState<
    Record<string, string>
  >({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [sortModalOpen, setSortModalOpen] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>("icd_desc");
  const [icdFilter, setIcdFilter] = useState<string>("");
  const [nameSearch, setNameSearch] = useState<string>("");
  const sortLabels: Record<string, string> = {
    icd_desc: "ICD Codes (High to Low)",
    icd_asc: "ICD Codes (Low to High)",
    name_asc: "Participant Name (A-Z)",
    name_desc: "Participant Name (Z-A)",
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: Participant[] = await response.json();
        setParticipants(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const fetchICDDescriptions = async (icdCodes: string[]) => {
    const descriptions: Record<string, string> = {};
  
    await Promise.all(
      icdCodes.map(async (code) => {
        try {
          // ✅ Query LHC API for ICD-10 descriptions
          const response = await fetch(`${ICD_API_URL}?sf=code,name&terms=${encodeURIComponent(code)}&maxList=1`);
          if (!response.ok) throw new Error(`LHC API Error: ${response.status}`);
  
          const data = await response.json();
          console.log("🔹 LHC API Response:", data);
  
          // ✅ Extract description if available
          if (data[0] > 0) {
            descriptions[code] = data[3][0][1]; // Extracts the ICD-10 description
          } else {
            descriptions[code] = "Unknown diagnosis";
          }
        } catch (error) {
          console.error("🚨 Error fetching ICD description:", error);
          descriptions[code] = "Unknown diagnosis";
        }
      })
    );
  
    setIcdDescriptions(descriptions);
  };
  

  const handleRowClick = async (participant: Participant) => {
    setSelectedParticipant(participant);
    setModalOpen(true);

    const icdCodes = participant.diagnoses.map((d) => d.icdCode);
    await fetchICDDescriptions(icdCodes);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setSelectedParticipant(null);
      setIcdDescriptions({});
    }, 300);
  };

  const applySortingAndFiltering = (type: string, filter: string) => {
    setSortType(type);
    setIcdFilter(filter);
  };

  const sortedParticipants = [...participants]
    .filter(
      (p) =>
        (!nameSearch ||
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .includes(nameSearch.toLowerCase())) &&
        (!icdFilter || p.diagnoses.some((d) => d.icdCode.includes(icdFilter)))
    )
    .sort((a, b) => {
      if (sortType === "icd_desc")
        return b.diagnoses.length - a.diagnoses.length;
      if (sortType === "icd_asc")
        return a.diagnoses.length - b.diagnoses.length;
      if (sortType === "name_asc")
        return a.firstName.localeCompare(b.firstName);
      if (sortType === "name_desc")
        return b.firstName.localeCompare(a.firstName);
      return 0;
    });

  const filteredParticipants = participants
    .filter(
      (p) =>
        (!nameSearch ||
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .includes(nameSearch.toLowerCase())) &&
        (!icdFilter || p.diagnoses.some((d) => d.icdCode.includes(icdFilter)))
    )
    .sort((a, b) => {
      if (sortType === "icd_desc")
        return b.diagnoses.length - a.diagnoses.length;
      if (sortType === "icd_asc")
        return a.diagnoses.length - b.diagnoses.length;
      if (sortType === "name_asc")
        return a.firstName.localeCompare(b.firstName);
      if (sortType === "name_desc")
        return b.firstName.localeCompare(a.firstName);
      return 0;
    });

  const speakText = (text: string) => {
    if (!text || typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; 
    speech.rate = 1; 
    speech.pitch = 1; 
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Participants
      </Typography>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table aria-label="List of participants with ICD codes">
          <TableHead>
            <tr className={styles.headerRow}>
              <th className={styles.headerText1}>
                <TextField
                  variant="outlined"
                  placeholder="Search Participant..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  fullWidth
                  aria-label="Search for a participant"
                />
              </th>
              <th
                className={styles.headerText2}
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setSortModalOpen(true)}
                role="button"
                aria-label={`Sort participants by ${sortLabels[sortType]}`}
              >
                {sortLabels[sortType] || "ICD Codes"}{" "}
                <ArrowDropDownIcon className={styles.icon} />
              </th>
            </tr>
          </TableHead>
        </Table>
        <hr className={styles.hr} />

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className={styles.customBody}>
            {sortedParticipants.map((participant, index) => (
              <div
                key={index}
                className={styles.customRow}
                onClick={() => handleRowClick(participant)}
                aria-label={`View details for participant ${participant.firstName} ${participant.lastName}`}
                tabIndex={0}
                role="button"
              >
                <div
                  className={`${styles.participantText} ${styles.roundedCellLeft} notranslate`}
                >
                  {participant.firstName} {participant.lastName}
                </div>
                <div
                  className={`${styles.icdCount} ${styles.roundedCellRight}`}
                  aria-label={`Number of ICD codes: ${participant.diagnoses.length}`}
                >
                  {participant.diagnoses.length}
                </div>
              </div>
            ))}
          </div>
        )}
      </TableContainer>

      <Dialog
        fullScreen
        open={modalOpen}
        onClose={handleCloseModal}
        classes={{ paper: styles.modalContainer }}
        aria-labelledby="participant-details-modal"
      >
        <Navbar />
        <DialogContent className={styles.modalContent}>
          <Button
            className={styles.backButton}
            variant="contained"
            onClick={handleCloseModal}
            aria-label="Close participant details"
          >
            ← Back
          </Button>

          <div className={styles.diagnosisSection}>
            <Typography
              variant="h4"
              className={`${styles.participantName} notranslate`}
            >
              {" "}
              {selectedParticipant?.firstName} {selectedParticipant?.lastName}
            </Typography>
            <hr className={styles.hr} />

            <Typography variant="subtitle1" className={styles.icdCountHeader}>
              ICD Codes ({selectedParticipant?.diagnoses.length})
            </Typography>

            <div className={styles.diagnosisList}>
              {selectedParticipant?.diagnoses.map((diagnosis, idx) => (
                <div key={idx} className={styles.diagnosisItem}>
                  <span
                    className={styles.diagnosisText}
                    aria-live="polite"
                    aria-label={`ICD Code: ${diagnosis.icdCode}, ${
                      icdDescriptions[diagnosis.icdCode] || "Unknown diagnosis"
                    }`}
                  >
                    {icdDescriptions[diagnosis.icdCode] || "Loading..."}
                  </span>

                  <span className={styles.icdCode}>
                    {" "}
                    <button
                      onClick={() =>
                        speakText(
                          icdDescriptions[diagnosis.icdCode] ||
                            "Unknown diagnosis"
                        )
                      }
                      aria-label={`Read aloud ICD code description: ${
                        icdDescriptions[diagnosis.icdCode]
                      }`}
                      className={styles.speakButton}
                    >
                      🔊
                    </button>
                    {diagnosis.icdCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={sortModalOpen}
        onClose={() => setSortModalOpen(false)}
        className={styles.sortModalContainer}
        aria-labelledby="sort-modal-title"
        role="dialog"
      >
        <DialogContent className={styles.sortModalContent}>
          <Typography
            variant="h5"
            className={styles.sortModalTitle}
            id="sort-modal-title"
          >
            Sort & Filter Participants
          </Typography>

          <Typography variant="subtitle2" className={styles.filterLabel}>
            Sort by:
          </Typography>
          <Select
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
              setSortModalOpen(false);
            }}
            fullWidth
            variant="outlined"
            className={styles.sortSelect}
            aria-label="Sort participants by"
          >
            <MenuItem value="icd_desc">ICD Codes (High to Low)</MenuItem>
            <MenuItem value="icd_asc">ICD Codes (Low to High)</MenuItem>
            <MenuItem value="name_asc">Participant Name (A-Z)</MenuItem>
            <MenuItem value="name_desc">Participant Name (Z-A)</MenuItem>
          </Select>

          <Typography variant="subtitle2" className={styles.filterLabel}>
            Search by ICD Code:
          </Typography>
          <TextField
            placeholder="Enter ICD Code (Case Sensitive)"
            value={icdFilter}
            onChange={(e) => setIcdFilter(e.target.value)}
            fullWidth
            variant="outlined"
            className={styles.icdSearchInput}
            aria-label="Search for a participant by ICD code"
          />

          <div className={styles.buttonContainer}>
            <Button
              onClick={() => setSortModalOpen(false)}
              className={styles.cancelButton}
              aria-label="Apply sorting and filtering options"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantsTable;
