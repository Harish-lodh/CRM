// src/pages/AdminLeadFields.jsx
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import customSelectStyles from "../../utils/CustomCss";
import { addleadfield, deletefield, getleadfield } from "../../api/api";
import Loader from "../../components/leads/FadeLoaderCustom";

// 🔒 Columns the admin should not delete from the DB table
const PROTECTED_COLUMNS = new Set([
  "id",
  "created_at",
  "updated_at",
  "status",
  "lan",
  "partner_loan_id",
]);

// Map simple UI types → MySQL types (backend will actually use these)
const UI_TYPES = [
  { value: "text", label: "Text (VARCHAR)" }, // → VARCHAR(255)
  { value: "email", label: "Email (VARCHAR)" }, // → VARCHAR(255)
  { value: "number", label: "Number (DECIMAL)" }, // → DECIMAL(15,2)
  { value: "int", label: "Integer (INT)" }, // → INT
  { value: "date", label: "Date (DATE)" }, // → DATE
];

// Required/Nullable selector options
const REQUIRED_OPTIONS = [
  { value: true, label: "Required (NOT NULL)" },
  { value: false, label: "Optional (NULL allowed)" },
];

export default function AdminLeadFields() {
  const [loading, setLoading] = useState(false);
  const [cols, setCols] = useState([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState(UI_TYPES[0]);
  const [isRequired, setIsRequired] = useState(REQUIRED_OPTIONS[1]); // default: optional

  const fetchCols = async () => {
    setLoading(true);
    try {
      const { data } = await getleadfield();
      // Expecting an array of { name, dbType, isNullable }
      setCols(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCols();
  }, []);

  const safeCols = useMemo(
    () =>
      cols.map((c) => ({
        ...c,
        canDelete: !PROTECTED_COLUMNS.has((c.name || "").toLowerCase()),
      })),
    [cols]
  );

  const addField = async () => {
    const name = (newName || "").trim().toLowerCase().replace(/\s+/g, "_");
    if (!name) return toast.warn("Field name is required");
    if (!newType) return toast.warn("Select a type");

    try {
      await addleadfield({
        name,
        uiType: newType.value,
        // If field is "required", that means NOT NULL → isNullable = false
        isNullable: !isRequired.value,
      });
      toast.success(`Column '${name}' created`);
      setNewName("");
      setNewType(UI_TYPES[0]);
      setIsRequired(REQUIRED_OPTIONS[1]); // reset to optional
      fetchCols();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.error || "Failed to add column");
    }
  };

  const deleteField = async (name) => {
    if (!window.confirm(`Delete column '${name}' from database?`)) return;
    try {
      await deletefield(name);
      toast.success(`Deleted '${name}'`);
      fetchCols();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.error || "Failed to delete column");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-900">Admin: Lead Fields</h1>
          <button
            onClick={fetchCols}
            className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <RefreshIcon fontSize="small" /> Refresh
          </button>
        </div>

        {/* Add field */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Add New Field (adds DB column)</h3>
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="text-sm text-gray-900">Column Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. first_name"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-900">Type</label>
              <Select
                value={newType}
                onChange={(v) => setNewType(v)}
                options={UI_TYPES}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="text-sm text-gray-900">Is Required</label>
              <Select
                value={isRequired}
                onChange={(v) => setIsRequired(v)}
                options={REQUIRED_OPTIONS}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addField}
                className="w-full px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2"
              >
                <AddIcon fontSize="small" /> Add Column
              </button>
            </div>
          </div>
        </div>

        {/* Columns table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Current Columns</h3>

          {loading ? (
            <div className="flex items-center justify-center min-h-[160px]">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th className="py-2">Field Type</th>
                    <th className="py-2">Nullable</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {safeCols.map((c) => {
                    const isNullable = c.isNullable === true || c.isNullable === 'YES';
                    return (
                      <tr key={c.name} className="border-b">
                        <td className="py-2 font-medium">{c.name}</td>
                        <td className="py-2">{c.dbType}</td>
                        <td className="py-2">{isNullable ? 'YES' : 'NO'}</td>
                        <td className="py-2">
                          <button
                            disabled={!c.canDelete}
                            onClick={() => deleteField(c.name)}
                            className={`px-2 py-1 rounded-lg flex items-center gap-1 ${c.canDelete
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            title={c.canDelete ? 'Delete column' : 'Protected column'}
                          >
                            <DeleteIcon fontSize="small" /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
