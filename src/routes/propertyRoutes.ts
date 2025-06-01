import express, { Request, Response, NextFunction } from 'express';
import { createProperty, getProperties, updateProperty, deleteProperty } from '../controllers/propertyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Improved type definition for asyncHandler
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Apply asyncHandler to all route handlers for consistent error handling
router.route('/')
  .get(asyncHandler(getProperties))
  .post(protect, asyncHandler(createProperty));

router.route('/:id')
  .put(protect, asyncHandler(updateProperty))
  .delete(protect, asyncHandler(deleteProperty));

export default router;