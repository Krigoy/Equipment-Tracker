import React, { useState, useMemo } from 'react';
import './EquipmentTable.css';

function EquipmentTable({ equipment, onEdit, onDelete, onAddEquipment }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortField, setSortField] = useState('last_cleaned_date');
    const [sortDirection, setSortDirection] = useState('asc');

    const filteredAndSortedEquipment = useMemo(() => {
        if (!equipment || equipment.length === 0) {
            return [];
        }

        // Filter equipment
        let filtered = equipment.filter(eq => {
            if (!eq || typeof eq !== 'object') return false;

            // Handle search: if search term exists, check if name contains it
            const searchLower = searchTerm ? searchTerm.toLowerCase().trim() : '';
            const matchesSearch = !searchLower ||
                (eq.name && typeof eq.name === 'string' && eq.name.toLowerCase().includes(searchLower));

            // Handle type filter: if filter exists, check if type matches
            const matchesType = !typeFilter || eq.type === typeFilter;

            return matchesSearch && matchesType;
        });

        // Create a copy before sorting to avoid mutating original
        const sorted = [...filtered].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'last_cleaned_date') {
                aVal = aVal ? new Date(aVal) : new Date(0);
                bVal = bVal ? new Date(bVal) : new Date(0);
            } else {
                aVal = String(aVal || '').toLowerCase();
                bVal = String(bVal || '').toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return sorted;
    }, [equipment, searchTerm, typeFilter, sortField, sortDirection]);

    const handleSort = (field) => {
        if (field === 'last_cleaned_date') {
            if (sortField === field) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortField(field);
                setSortDirection('asc');
            }
        }
    };

    return (
        <div className="equipment-table-container">
            <div className="equipment-table-header">
                <div className="equipment-table-heading">
                    <h2 className="equipment-table-title">Equipment List</h2>
                    <div className="equipment-table-helper">
                        Type is auto-suggested when adding equipment, and you can always override it.
                    </div>
                </div>

                {onAddEquipment && (
                    <button className="add-equipment-btn" onClick={onAddEquipment}>
                        Add Equipment
                    </button>
                )}
            </div>

            <div className="table-controls">
                <div className="search-filter-group">
                    <div className="search-box">
                        <label htmlFor="search">Search by Name:</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Enter equipment name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-box">
                        <label htmlFor="typeFilter">Filter by Type:</label>
                        <select
                            id="typeFilter"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="Machine">Machine</option>
                            <option value="Vessel">Vessel</option>
                            <option value="Tank">Tank</option>
                            <option value="Mixer">Mixer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th
                                className="sortable"
                                onClick={() => handleSort('last_cleaned_date')}
                            >
                                Last Cleaned Date
                                {sortField === 'last_cleaned_date' && (
                                    <span className="sort-indicator">
                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                    </span>
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedEquipment.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-results-cell">
                                    {equipment.length === 0
                                        ? 'No equipment added yet.'
                                        : 'No equipment matches your search/filter criteria.'}
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedEquipment.map(eq => {
                                if (!eq) return null;

                                const formatDate = (dateStr) => {
                                    if (!dateStr) return 'N/A';
                                    try {
                                        // Parse 'YYYY-MM-DD' as a local date so it isn't shown a day early.
                                        const date = new Date(String(dateStr).slice(0, 10) + 'T00:00:00');
                                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                                    } catch (e) {
                                        return 'N/A';
                                    }
                                };

                                const getStatusClass = (status) => {
                                    if (!status) return '';
                                    return status.toLowerCase().replace(/\s+/g, '-');
                                };

                                return (
                                    <tr key={eq.id || Math.random()}>
                                        <td>{eq.id || 'N/A'}</td>
                                        <td>{eq.name || 'N/A'}</td>
                                        <td>{eq.type || 'N/A'}</td>
                                        <td>
                                            {eq.status ? (
                                                <span className={`status-badge status-${getStatusClass(eq.status)}`}>
                                                    {eq.status}
                                                </span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>{formatDate(eq.last_cleaned_date)}</td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => onEdit(eq)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => onDelete(eq.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EquipmentTable;

