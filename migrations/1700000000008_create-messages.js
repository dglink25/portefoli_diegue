exports.up = (pgm) => {
  pgm.createTable('messages', {
    id: 'id',
    full_name: { type: 'text', notNull: true },
    email: { type: 'text', notNull: true },
    subject: { type: 'text' },
    message: { type: 'text', notNull: true },
    read: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('messages', 'read');
};

exports.down = (pgm) => {
  pgm.dropTable('messages');
};
