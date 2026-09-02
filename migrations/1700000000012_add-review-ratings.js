exports.up = (pgm) => {
  pgm.createTable('review_ratings', {
    id:         { type: 'serial', primaryKey: true },
    review_id:  { type: 'integer', notNull: true, references: '"reviews"', onDelete: 'CASCADE' },
    voter_name: { type: 'text', notNull: true },
    rating:     { type: 'smallint', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.addConstraint('review_ratings', 'review_ratings_rating_range', 'CHECK (rating BETWEEN 1 AND 5)');
  pgm.createIndex('review_ratings', 'review_id');
};

exports.down = (pgm) => {
  pgm.dropTable('review_ratings');
};
