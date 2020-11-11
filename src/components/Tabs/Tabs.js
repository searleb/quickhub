import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const Tabs = ({ buttons, panes }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const btns = buttons.reduce((acc, btn, i) => [...acc, { id: i, content: btn }], []);

  return (
    <section className="relative">
      <div>
        <ul className="flex overflow-x-auto list-none">
          {btns.map((btn) => (
            <Button
              className="inline-flex w-full"
              onClick={() => setTabIndex(btn.id)}
              text={btn.content}
            />
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
