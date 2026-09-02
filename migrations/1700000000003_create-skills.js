exports.up = (pgm) => {
  pgm.createTable('skills', {
    id: 'id',
    name: { type: 'text', notNull: true },
    category: { type: 'text', notNull: true, default: 'general' },
    level: { type: 'smallint', notNull: true, default: 3 },
    icon: { type: 'text' },
    order_index: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.addConstraint('skills', 'skills_level_range', 'CHECK (level BETWEEN 1 AND 5)');
  pgm.createIndex('skills', 'order_index');
};

exports.down = (pgm) => {
  pgm.dropTable('skills');
};
