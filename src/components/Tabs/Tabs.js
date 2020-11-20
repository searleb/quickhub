import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Tabs = ({ buttons, panes }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <section>
      <div className="overflow-hidden">
        <ul className="flex items-center pt-2 overflow-x-auto list-none bg-gray-200 no-scrollbar">
          {buttons.map((btn, i) => (
            <button
              key={btn}
              type="button"
              className={cn('font-medium p-3 rounded-t-md whitespace-no-wrap focus:bg-white focus:text-black focus:outline-none', {
                'bg-white shadow z-10': i === tabIndex,
                'bg-blue-900 text-blue-100 shadow-inner': i !== tabIndex,
              })}
              onClick={() => setTabIndex(i)}
            >
              {btn}
            </button>
          ))}
        </ul>
      </div>
      {panes.map((pane, i) => (
        i === tabIndex && <div key={pane}>{pane}</div>
      ))}
    </section>
  );
};

Tabs.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  panes: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Tabs;
