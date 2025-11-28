import express from 'express';
import jobCtrl from '../controllers/job.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

// Param middleware: automatically loads job by ID when :jobId is present
router.param('jobId', jobCtrl.jobByID);

// Protect all job routes with signin + role attachment
router.use(authCtrl.requireSignin, authCtrl.attachUserRole);

// List all jobs / Create new job
router
  .route('/')
  .get(jobCtrl.list)
  .post(authCtrl.hasRole('admin', 'manager'), jobCtrl.create);

// Read / Update / Delete single job
router
  .route('/:jobId')
  .get((req, res) => res.json(req.job)) // optional: return single job
  .put(jobCtrl.update) // role checks can be added here later
  .delete(authCtrl.hasRole('admin', 'manager'), jobCtrl.remove);

export default router;