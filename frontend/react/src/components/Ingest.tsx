import { useState } from "react";
import IngestForm from "./IngestForm";
import { classNames } from "../utils/classNames";
import AutoIngestForm from "./AutoIngestForm";

export default function Ingest() {
  const [tab, setTab] = useState("upload");

  return (
    <>
      <div className="text-center">
        <span className="mb-4 mt-2 inline-flex shadow-sm rounded-md">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={classNames(tab === "upload" ? "shadow-inner bg-gray-100" : "hover:bg-gray-50", "relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-700")}
          >
            Upload JSON
          </button>
          <button
            type="button"
            onClick={()=>setTab("auto")}
            className={classNames(tab === "auto" ? "shadow-inner bg-gray-100" : "hover:bg-gray-50", "-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-700 ")}
          >
            Auto Ingest
          </button>
        </span>
      </div>
     {tab === "upload" && <IngestForm />}
     {tab === "auto" && <AutoIngestForm />}
    </>
  );
}
