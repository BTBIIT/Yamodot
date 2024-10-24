import React from "react";
import ScheduleSection from "../sections/ScheduleSection";
import PredictionSection from "../sections/PredictionSection";
import RecordSection from "../sections/RecordSection";
// import "./MainContent.css";

const MainContent = () => {
  return (
    <div className="main-content">
      <ScheduleSection />
      <PredictionSection />
      <RecordSection />
    </div>
  );
};

export default MainContent;
