exports.up = (pgm) => {
  pgm.createTable('blog_posts', {
    id: 'id',
    slug: { type: 'citext', notNull: true, unique: true },
    title_fr: { type: 'text', notNull: true },
    title_en: { type: 'text', notNull: true },
    excerpt_fr: { type: 'text', notNull: true, default: '' },
    excerpt_en: { type: 'text', notNull: true, default: '' },
    content_fr: { type: 'text', notNull: true, default: '' },
    content_en: { type: 'text', notNull: true, default: '' },
    cover_image: { type: 'text' },
    published: { type: 'boolean', notNull: true, default: false },
    published_at: { type: 'timestamptz' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('blog_posts', 'published');
};

exports.down = (pgm) => {
  pgm.dropTable('blog_posts');
};
