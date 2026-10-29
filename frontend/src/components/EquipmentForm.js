import React, { useState, useEffect, useRef } from 'react';
import './EquipmentForm.css';
import { inferType } from '../services/api';

function EquipmentForm({ equipment, onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('Active');
    const [lastCleanedDate, setLastCleanedDate] = useState('');
    const [inferenceSuggestion, setInferenceSuggestion] = useState(null);
    // Latest name typed, so a slow inference response for an older name is ignored.
    const latestNameRef = useRef('');

    useEffect(() => {
        if (equipment) {
            setName(equipment.name || '');
            setType(equipment.type || '');
            setStatus(equipment.status || 'Active');

            // Convert ISO date string to YYYY-MM-DD format for date input
            // The API returns DATE values as 'YYYY-MM-DD'; keep only the date part
            // so the value never goes through a time-zone conversion.
            const dateValue = equipment.last_cleaned_date
                ? String(equipment.last_cleaned_date).slice(0, 10)
                : '';
            setLastCleanedDate(dateValue);
            setInferenceSuggestion(null);
        } else {
            setName('');
            setType('');
            setStatus('Active');
            setLastCleanedDate('');
            setInferenceSuggestion(null);
        }
    }, [equipment]);

    const handleNameChange = async (e) => {
        const newName = e.target.value;
        setName(newName);
        latestNameRef.current = newName;

        // Attempt type inference only when adding new equipment (not editing)
        if (!equipment && newName.trim()) {
            try {
                const inferenceResult = await inferType(newName);
                if (latestNameRef.current !== newName) return;
                setInferenceSuggestion(inferenceResult);

                // Auto-fill type if inference is successful and not null
                if (inferenceResult.type && inferenceResult.confidence !== 'low') {
                    setType(inferenceResult.type);
                }
            } catch (err) {
                setInferenceSuggestion(null);
            }
        } else {
            setInferenceSuggestion(null);
        }
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setInferenceSuggestion(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !type || !status || !lastCleanedDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await onSubmit({
                name: name.trim(),
                type,
                status,
                last_cleaned_date: lastCleanedDate,
            });

            // Only reset form if creating new equipment (not editing) and submission succeeded
            if (!equipment) {
                setName('');
                setType('');
                setStatus('Active');
                setLastCleanedDate('');
                setInferenceSuggestion(null);
            }
        } catch (err) {
            // Error handling is done in parent component
            // Don't reset form on error
        }
    };

    return (
        <form className="equipment-form" onSubmit={handleSubmit}>
            <h2>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>

            <div className="form-group">
                <label htmlFor="name">
                    Name <span className="required-indicator">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">
                    Type <span className="required-indicator">*</span>
                </label>
                <select
                    id="type"
                    value={type}
                    onChange={handleTypeChange}
                    required
                >
                    <option value="">Select type</option>
                    <option value="Machine">Machine</option>
                    <option value="Vessel">Vessel</option>
                    <option value="Tank">Tank</option>
                    <option value="Mixer">Mixer</option>
                </select>

                {inferenceSuggestion && (
                    <div className="ai-suggestion">
                        <div className="suggestion-header">
                            <span className="suggestion-icon">🤖</span>
                            <span className="suggestion-label">AI Suggestion:</span>
                            <span className="suggested-type">{inferenceSuggestion.type || 'None'}</span>
                            <span className={`confidence-badge confidence-${inferenceSuggestion.confidence}`}>
                                {inferenceSuggestion.confidence}
                            </span>
                        </div>
                        <div className="suggestion-reason">
                            {inferenceSuggestion.reason}
                        </div>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="status">
                    Status <span className="required-indicator">*</span>
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="lastCleanedDate">
                    Last Cleaned Date <span className="required-indicator">*</span>
                </label>
                <input
                    type="date"
                    id="lastCleanedDate"
                    value={lastCleanedDate}
                    onChange={(e) => setLastCleanedDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="submit">{equipment ? 'Update' : 'Add'} Equipment</button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="cancel-btn">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default EquipmentForm;

