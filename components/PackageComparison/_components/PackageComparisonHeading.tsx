import IPackage from 'types/IPackage';

import PackageLinks from 'components/_components/PackageLinks';

type Props = {
  packetNames: string[];
  packets: IPackage[];
};

const PackageComparisonHeading = ({ packetNames, packets }: Props) => {
  const pageHeading = () => {
    if (!packetNames.length) return <span className="text--bold">Compare package download counts over time</span>;
    return packetNames.map(
      (name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {packetNames.length - 1 !== i && ' vs '}
        </span>
      ),
      this,
    );
  };

  const isSinglePacket = () => packets.length === 1;

  const singlePacketContent = () => {
    const firstPacket = packets[0];

    return (
      <div className="comparison-heading--subheading">
        <p className="comparison-heading--description">{firstPacket.description}</p>
        <div className="comparison-heading--links">
          {firstPacket.description && <div className="comparison-heading--divider" />}
          <PackageLinks packet={firstPacket} />
        </div>
      </div>
    );
  };

  return (
    <div className="comparison-heading--container">
      <h1 className="comparison-heading--heading">{pageHeading()}</h1>
      {isSinglePacket() && singlePacketContent()}
    </div>
  );
};

export default PackageComparisonHeading;
