const equipmentService = require('../services/equipmentService');
const { getInferenceProvider } = require('../services/typeInferenceService');

const VALID_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const VALID_STATUSES = ['Active', 'Inactive', 'Under Maintenance'];

function validateEquipment(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name is required');
  }
  
  if (!data.type || !VALID_TYPES.includes(data.type)) {
    errors.push('type must be one of: Machine, Vessel, Tank, Mixer');
  }
  
  if (!data.status || !VALID_STATUSES.includes(data.status)) {
    errors.push('status must be one of: Active, Inactive, Under Maintenance');
  }
  
  if (!data.last_cleaned_date) {
    errors.push('last_cleaned_date is required');
  } else {
    const date = new Date(data.last_cleaned_date);
    if (isNaN(date.getTime())) {
      errors.push('last_cleaned_date must be a valid date');
    }
  }
  
  return errors;
}

async function getAllEquipment(req, res) {
  try {
    const equipment = await equipmentService.listEquipment();
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
}

async function createEquipment(req, res) {
  try {
    const errors = validateEquipment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { name, type, status, last_cleaned_date } = req.body;
    
    // Attempt type inference if type is missing
    let inferredType = type;
    if (!inferredType) {
      const inferenceProvider = getInferenceProvider();
      inferredType = inferenceProvider.inferType(name);
    }
    
    // If still no type, return error (don't store incomplete records)
    if (!inferredType) {
      return res.status(400).json({ errors: ['type is required'] });
    }
    
    const equipment = await equipmentService.createEquipment({
      name: name.trim(),
      type: inferredType,
      status,
      last_cleaned_date,
    });
    
    res.status(201).json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
}

async function updateEquipment(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid equipment ID' });
    }
    
    const errors = validateEquipment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { name, type, status, last_cleaned_date } = req.body;
    
    const equipment = await equipmentService.updateEquipment(id, {
      name: name.trim(),
      type,
      status,
      last_cleaned_date,
    });
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
}

async function deleteEquipment(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid equipment ID' });
    }
    
    const deleted = await equipmentService.deleteEquipment(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
}

async function inferType(req, res) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required' });
    }

    const inferenceProvider = getInferenceProvider();
    const inferenceResult = inferenceProvider.inferType(name);

    res.status(200).json(inferenceResult);
  } catch (error) {
    console.error('Error inferring type:', error);
    res.status(500).json({ error: 'Failed to infer type' });
  }
}

module.exports = {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  inferType,
};

