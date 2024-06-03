import CountdownTimer from "components/_components/CountdownTimer";

const QueryGGBanner = () => (
  <aside className="query-container container">
    <div className="query-banner">
      <a href="https://query.gg?s=usehooks" className="query-header">
        <img
          src={"/images/querygg/corner-top-left.svg"}
          alt="sun"
          className="corner-sun"
        />
        <img
          src={"/images/querygg/header-course.svg"}
          alt="Query.gg - The Official React Query Course"
          className="query-headline"
        />
        <img
          src={"/images/querygg/corner-top-right.svg"}
          alt="moon"
          className="corner-moon"
        />
      </a>
      <div className="query-spacer"></div>
      <div className="query-cta">
        <div className="query-cta-container">
          <h2>Launch week sale</h2>
          <p>Up to 30% off through June 5th</p>
          <CountdownTimer targetDate="2024-06-06" />
          <a href="https://query.gg?s=usehooks" className="query-button">Join now</a>
        </div>
        <img
          src={"/images/querygg/corner-fish-bottom-right.svg"}
          alt="mutated fish"
          className="corner-fish"
        />
      </div>
    </div>
  </aside>
);

export default QueryGGBanner;
