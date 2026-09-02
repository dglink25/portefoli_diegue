exports.up = (pgm) => {
  pgm.createTable('profile', {
    id: { type: 'smallint', primaryKey: true, default: 1 },
    full_name: { type: 'text', notNull: true, default: '' },
    title_fr: { type: 'text', notNull: true, default: '' },
    title_en: { type: 'text', notNull: true, default: '' },
    bio_fr: { type: 'text', notNull: true, default: '' },
    bio_en: { type: 'text', notNull: true, default: '' },
    avatar_url: { type: 'text' },
    email: { type: 'text' },
    location: { type: 'text' },
    social_links: { type: 'jsonb', notNull: true, default: pgm.func("'{}'::jsonb") },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.addConstraint('profile', 'profile_singleton', 'CHECK (id = 1)');
  pgm.sql(`INSERT INTO profile (id) VALUES (1) ON CONFLICT DO NOTHING;`);
};

exports.down = (pgm) => {
  pgm.dropTable('profile');
};
