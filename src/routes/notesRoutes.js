import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/', getAllNotes);
router.get('/:noteId', getNoteById);
router.post('/', createNote);
router.delete('/:noteId', deleteNote);
router.patch('/:noteId', updateNote);

export default router;