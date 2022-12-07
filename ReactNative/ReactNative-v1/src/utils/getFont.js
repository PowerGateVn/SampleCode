import invariant from 'invariant';

import fonts from '~app/assets/fonts';

export default name => {
  const font = fonts[name];
  invariant(font, `missing font named ${name}`);
  return font;
};