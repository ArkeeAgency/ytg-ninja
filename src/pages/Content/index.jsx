import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';

const main = () => {
  const colElement = document.querySelector('div#col-comments');
  const container = document.createElement('div');
  container.className = 'flex-column w-100';
  container.id = 'ytg-ninja';
  colElement.prepend(container);
  const root = createRoot(container);
  root.render(<Content />);
};

if (window.location.href.startsWith('https://yourtext.guru/guide/')) {
  main();
}
