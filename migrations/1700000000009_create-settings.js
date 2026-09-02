exports.up = (pgm) => {
  pgm.createTable('settings', {
    key: { type: 'text', primaryKey: true },
    value: { type: 'jsonb', notNull: true },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.sql(`
    INSERT INTO settings (key, value) VALUES
      ('theme', '{"default": "light", "allowUserOverride": true, "primaryColor": "#0066FF", "footerColor": "#373F51"}'),
      ('locale', '{"default": "fr", "available": ["fr", "en"]}')
    ON CONFLICT (key) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('settings');
};
