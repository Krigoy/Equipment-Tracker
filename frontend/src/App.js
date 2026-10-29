import React, { useState, useEffect } from "react";
import "./App.css";
import EquipmentTable from "./components/EquipmentTable";
import EquipmentForm from "./components/EquipmentForm";
import EquipmentModal from "./components/EquipmentModal";
import {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "./services/api";

function App() {
  const [equipment, setEquipment] = useState([]);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadEquipment();
    // Load once on mount; loadEquipment is also called after each change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError("Failed to load equipment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (equipmentData) => {
    try {
      setError(null);
      const newEquipment = await createEquipment(equipmentData);
      setEquipment([...equipment, newEquipment]);
      setModalOpen(false);
    } catch (err) {
      setError(
        "Failed to create equipment. Please check all fields are filled.",
      );
      throw err;
    }
  };

  const handleUpdate = async (id, equipmentData) => {
    try {
      setError(null);
      const updatedEquipment = await updateEquipment(id, equipmentData);
      setEquipment(
        equipment.map((eq) => (eq.id === id ? updatedEquipment : eq)),
      );
      setEditingEquipment(null);
      setModalOpen(false);
    } catch (err) {
      setError(
        "Failed to update equipment. Please check all fields are filled.",
      );
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) {
      return;
    }
    try {
      setError(null);
      await deleteEquipment(id);
      setEquipment(equipment.filter((eq) => eq.id !== id));
    } catch (err) {
      setError("Failed to delete equipment.");
      console.error(err);
    }
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingEquipment(null);
    setModalOpen(false);
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setModalOpen(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Equipment Tracker</h1>
        <p className="App-subtitle">
          Track equipment details, cleaning history, and operational status.
        </p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="app-content">
        {loading ? (
          <div className="loading">Loading equipment...</div>
        ) : (
          <EquipmentTable
            equipment={equipment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddEquipment={handleAddEquipment}
          />
        )}
      </div>

      <EquipmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <EquipmentForm
          equipment={editingEquipment}
          onSubmit={
            editingEquipment
              ? (data) => handleUpdate(editingEquipment.id, data)
              : handleCreate
          }
          onCancel={handleCancelEdit}
        />
      </EquipmentModal>
    </div>
  );
}

export default App;
