<script lang="ts" context="module">
  import Bold from 'quill/formats/bold';
  import Header from 'quill/formats/header';
  import Italic from 'quill/formats/italic';
  import Link from 'quill/formats/link';
  import List from 'quill/formats/list';
  import Underline from 'quill/formats/underline';
  import Toolbar from 'quill/modules/toolbar';
  import Snow from 'quill/themes/snow';

  Quill.register({
    'modules/toolbar': Toolbar,
    'themes/snow': Snow,
    'formats/bold': Bold,
    'formats/header': Header,
    'formats/italic': Italic,
    'formats/link': Link,
    'formats/list': List,
    'formats/underline': Underline,
  });
</script>

<script lang="ts">
  import 'quill/dist/quill.snow.css';

  import Quill, { Delta, type EmitterSource } from 'quill/core';
  import { onMount } from 'svelte';

  export let contents: Delta;
  $: setContents(contents, 'api');

  export let readOnly = false;
  export let showControls = true;

  let editorDiv: HTMLElement;
  let editor: Quill;

  const setContents = (s: Delta, source: EmitterSource) => {
    if (editor && source !== 'api') editor.setContents(s, source);
  };

  onMount(() => {
    const modules: Record<string, unknown> = {};
    if (!showControls) modules.toolbar = false;

    editor = new Quill(editorDiv, {
      theme: 'snow',
      readOnly,
      modules,
    });

    editor.setContents(contents, 'api');
    editor.on('text-change', (_, __, source) => {
      const c = editor.getContents();
      if (source === 'user') {
        contents = c;
      }
    });
  });
</script>

<div bind:this={editorDiv} />
