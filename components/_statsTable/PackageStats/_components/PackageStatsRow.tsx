import PropTypes from 'prop-types';

const propTypes = {
  packet: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
};

const PackageStatsRow = ({ packet, columns }) => {
  const rowCells = () =>
    columns.map((column) => (
      <td key={`${packet.name}_${column.heading.replace(/\s/g, '')}`}>{column.renderer(packet)}</td>
    ));

  return <tr key={packet.name}>{rowCells()}</tr>;
};

PackageStatsRow.propTypes = propTypes;

export default PackageStatsRow;
