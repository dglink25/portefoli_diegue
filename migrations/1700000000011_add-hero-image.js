exports.up = (pgm) => {
  pgm.addColumn('profile', {
    hero_image_url: { type: 'text', notNull: false }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('profile', 'hero_image_url');
};
