'use strict';
'format es6'; // force SystemJS to transpile exercise

function write(first, ...allTheArguments) {
  const element = document.getElementById('example');

  element.innerHTML = first.toUpperCase()  + ' ' + allTheArguments
    .reduce((prev, curr) => prev + ' ' + curr, '');

}

write('JavaScript', 'For', 'Life');
