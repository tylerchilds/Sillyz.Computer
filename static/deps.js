import tag, { listen, on, signal, read, write } from 'https://deno.land/x/tag@v0.3.2/mod.js';
import * as focusTrap from 'https://esm.sh/focus-trap';
import Color from "https://esm.sh/colorjs.io@0.4.0";
import Quill from 'https://esm.sh/quill@1.3.7'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const MONDRIAN_HOST = 'https://1998.social'

const randomString = (length) =>
  [ ...Array(length) ].map(() => (~~(Math.random() * 36)).toString(36)).join('');

export {
  MONDRIAN_HOST,
  randomString,
  createClient,
  Color,
  focusTrap,
  listen,
  on,
  Quill,
  read,
  signal,
  tag,
  write,
}
