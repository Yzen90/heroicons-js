import { appendFileSync, mkdirSync, readFileSync } from 'fs';

import glob from 'glob';
import { Parser } from 'htmlparser2';
import _ from 'lodash';

const base = 'node_modules/heroicons/';

const variants = [
  {
    name: 'solid',
    path: '24/solid/',
  },
  {
    name: 'outline',
    path: '24/outline/',
  },
  {
    name: 'mini',
    path: '20/solid/',
  },
];

let svg = '';

const parser = new Parser({
  onopentag(name, attr) {
    if (name === 'path') {
      if (svg.length > 0) svg += ' ';
      svg += attr['d'];
    }
  },
});

for (const { name, path } of variants) {
  mkdirSync(name);

  for (const file of glob.sync('*.svg', { cwd: base + path })) {
    svg = '';
    parser.write(readFileSync(base + path + file, { encoding: 'utf-8' }));

    const filename = file.split('.')[0]!;
    appendFileSync(name + '/index.ts', `export const ${_.camelCase(filename)}: string = "${svg}";\n`, {
      encoding: 'utf-8',
    });
  }
}
