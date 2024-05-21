const QueryGGBanner = () => (
  <aside className="query-container container">
    <div className="query-banner">
      <a href="https://query.gg" className="query-header">
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
          <h2>Launch sale happening now</h2>
          <div className="countdown">
            <div className="countdown-days">
              <span className="countdown-number">0</span>
              <span className="countdown-number">3</span>
              <p className="countdown-label">days</p>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-hours">
              <span className="countdown-number">2</span>
              <span className="countdown-number">1</span>
              <p className="countdown-label">hours</p>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-minutes">
              <span className="countdown-number">1</span>
              <span className="countdown-number">4</span>
              <p className="countdown-label">minutes</p>
            </div>
          </div>
          <a href="https://query.gg" className="query-button">Join now</a>
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
