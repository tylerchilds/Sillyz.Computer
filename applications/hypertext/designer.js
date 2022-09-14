import Quill from 'https://esm.sh/quill@1.3.7'

const SnowTheme = Quill.import('themes/snow');

class WozniakTheme extends SnowTheme {
	constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-wozniak');
  }

  extendToolbar(toolbar) {
		super.extendToolbar(toolbar);
    toolbar.container.classList.add('ql-wozniak');
  }
}

Quill.register('themes/wozniak', WozniakTheme, true)

let Inline = Quill.import('blots/inline');

class HighlighterBlot extends Inline {
  static blotName = 'highlighter';
  static tagName = 'highlighter';

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }

  optimize() {}
}

Quill.register(HighlighterBlot);


class VariableTextBlot extends Inline {
  static blotName = 'variable-text';
  static tagName = 'variable-text';

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }

  optimize() {}
}

Quill.register(VariableTextBlot);

var Parchment = Quill.import("parchment");

let CustomClass = new Parchment.Attributor.Class('custom', 'ql-custom', {
  scope: Parchment.Scope.INLINE
});

Quill.register(CustomClass, true);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }, [ 'highlighter' ]],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

function customEvents(quill, $) {
	$.on('click', '.ql-highlighter', (event) => {
		const format = quill.getFormat();
		if(format.custom) {
			quill.format('highlighter', '');
		} else {
			quill.format('highlighter', '');
		}
	})

	$.on('click', '.ql-variable-text', (event) => {
		const format = quill.getFormat();
		if(format.custom) {
			quill.format('variable-text', '');
		} else {
			quill.format('variable-text', '');
		}
	})
}


export { HighlighterBlot, WozniakTheme, toolbarOptions, customEvents }
