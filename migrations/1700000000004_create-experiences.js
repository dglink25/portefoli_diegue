exports.up = (pgm) => {
  pgm.createTable('experiences', {
    id: 'id',
    title_fr: { type: 'text', notNull: true },
    title_en: { type: 'text', notNull: true },
    company: { type: 'text', notNull: true },
    location: { type: 'text' },
    description_fr: { type: 'text', notNull: true, default: '' },
    description_en: { type: 'text', notNull: true, default: '' },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date' },
    order_index: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('experiences', 'start_date');
};

exports.down = (pgm) => {
  pgm.dropTable('experiences');
};
