const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.errors ? error.errors.join(', ') : error.error || 'Request failed');
  }
  return response.json();
}

export async function getAllEquipment() {
  const response = await fetch(`${API_BASE_URL}/equipment`);
  return handleResponse(response);
}

export async function createEquipment(equipment) {
  const response = await fetch(`${API_BASE_URL}/equipment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });
  return handleResponse(response);
}

export async function updateEquipment(id, equipment) {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });
  return handleResponse(response);
}

export async function deleteEquipment(id) {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return;
}

export async function inferType(name) {
  const response = await fetch(`${API_BASE_URL}/equipment/infer-type`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  return handleResponse(response);
}

