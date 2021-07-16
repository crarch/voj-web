import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

let updated = false;

function ListItemLink(props) {
  const { icon, primary, to, onClick } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  if (!updated) {
    updated = true;
    document.title = `${primary} - Verilog OJ`;
  }

  return (
    <li>
      <ListItem button component={renderLink} onClick={() => {
        document.title = `${primary} - Verilog OJ`;
        onClick && onClick();
      }}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default ListItemLink;

