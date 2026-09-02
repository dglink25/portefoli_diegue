exports.up = (pgm) => {
  pgm.createTable('gallery', {
    id: 'id',
    title: { type: 'text', notNull: true },
    description: { type: 'text' },
    image_url: { type: 'text', notNull: true },
    category: { type: 'text', notNull: true, default: 'general' },
    order_index: { type: 'integer', notNull: true, default: 0 },
    published: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('gallery', 'published');
  pgm.createIndex('gallery', 'order_index');
};

exports.down = (pgm) => {
  pgm.dropTable('gallery');
};
