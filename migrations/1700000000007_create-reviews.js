exports.up = (pgm) => {
  pgm.createTable('reviews', {
    id: 'id',
    full_name: { type: 'text', notNull: true },
    message: { type: 'text', notNull: true },
    rating: { type: 'smallint', notNull: true },
    published: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.addConstraint('reviews', 'reviews_rating_range', 'CHECK (rating BETWEEN 1 AND 5)');
  pgm.createIndex('reviews', 'published');
  pgm.createIndex('reviews', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('reviews');
};
