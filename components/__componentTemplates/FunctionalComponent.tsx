type Props = {
  animal: string;
};

const FunctionalComponent = ({ animal }: Props) => {
  const adjective = 'awesome';

  return (
    <div>
      {animal} are {adjective}.
    </div>
  );
};

export default FunctionalComponent;
