import { test } from 'uvu';
import * as assert from 'uvu/assert';

test('addition', () => {
  assert.is(2 + 2, 4);
});

test.run();
