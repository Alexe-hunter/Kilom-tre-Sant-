const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/schedules - create a new schedule (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') return res.status(403).json({ erreur: 'Accès refusé' });

    const { titre, type, date_debut, date_fin, details } = req.body;
    if (!titre || !type || !date_debut) return res.status(400).json({ erreur: 'Champs requis manquants' });

    const result = await db.query(
      `INSERT INTO schedules (titre, type, date_debut, date_fin, details, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, type, date_debut, date_fin || null, details ? JSON.stringify(details) : null, req.user.id]
    );

    res.status(201).json({ message: 'Planning créé', schedule: result.rows[0] });
  } catch (err) {
    console.error('Erreur POST /api/schedules:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// GET /api/schedules - list schedules (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') return res.status(403).json({ erreur: 'Accès refusé' });

    const result = await db.query('SELECT * FROM schedules ORDER BY date_debut DESC');
    res.json({ total: result.rows.length, schedules: result.rows });
  } catch (err) {
    console.error('Erreur GET /api/schedules:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
