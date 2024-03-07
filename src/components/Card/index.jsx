const Card = ({ extra, children }) => {
  return (
    <div
      className={`relative flex flex-col bg-white bg-clip-border shadow-md dark:border-storkedark dark:bg-boxdark dark:text-white dark:shadow-none ${extra}`}
    >
      {children}
    </div>
  );
};

export default Card;
