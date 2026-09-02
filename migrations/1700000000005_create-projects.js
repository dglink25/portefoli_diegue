exports.up = (pgm) => {
  pgm.createTable('projects', {
    id: 'id',
    slug: { type: 'citext', notNull: true, unique: true },
    title_fr: { type: 'text', notNull: true },
    title_en: { type: 'text', notNull: true },
    description_fr: { type: 'text', notNull: true, default: '' },
    description_en: { type: 'text', notNull: true, default: '' },
    cover_image: { type: 'text' },
    tags: { type: 'text[]', notNull: true, default: pgm.func("'{}'::text[]") },
    demo_url: { type: 'text' },
    repo_url: { type: 'text' },
    featured: { type: 'boolean', notNull: true, default: false },
    published: { type: 'boolean', notNull: true, default: true },
    order_index: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('projects', 'published');
  pgm.createIndex('projects', 'order_index');
};

exports.down = (pgm) => {
  pgm.dropTable('projects');
};
