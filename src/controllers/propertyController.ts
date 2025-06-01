import Property from '../models/Property';
import redis from '../config/redis'; // ✅ For caching etc
import { Request, Response } from 'express';
import { CustomRequest } from '../types/custom'; // Create this type if not exists

export const createProperty = async (req: CustomRequest, res: Response) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user?.id });
    
    // Invalidate cache
    await redis.del('properties');
    
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const cacheKey = `properties:${JSON.stringify(query)}`;

    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If not in cache, get from DB
    const properties = await Property.find(query)
      .populate('createdBy', 'name email')
      .lean();

    // Set cache with expiry
    await redis.set(cacheKey, JSON.stringify(properties), 'EX', 300); // 5 minutes cache

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

export const updateProperty = async (req: CustomRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.createdBy || property.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Invalidate cache
    const cacheKeys = await redis.keys('properties:*');
    if (cacheKeys.length) {
      await redis.del(cacheKeys);
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
};

export const deleteProperty = async (req: CustomRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.createdBy || property.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await property.deleteOne();

    // Invalidate cache
    const cacheKeys = await redis.keys('properties:*');
    if (cacheKeys.length) {
      await redis.del(cacheKeys);
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
};