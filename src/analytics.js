import * as $ from 'jquery';

function createAnalitycs() {
  let clickCounter = 0;
  let isDestroyed = false;

  const listener = () => clickCounter += 1;
  $(document).on('click', listener);

  return {
    destroy: () => {
      $(document).off('click', listener);
      isDestroyed = true;
    },

    getClicks: () => {
      if (isDestroyed) {
        return "Analytics is destroyed"
      }
      return clickCounter;
    },
  };
}

window.analytics = createAnalitycs();