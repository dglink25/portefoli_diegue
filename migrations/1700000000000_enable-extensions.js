exports.up = (pgm) => {
  pgm.createExtension('citext', { ifNotExists: true });
  pgm.createExtension('pgcrypto', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropExtension('citext');
  pgm.dropExtension('pgcrypto');
};
