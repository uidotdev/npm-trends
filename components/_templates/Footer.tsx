const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-content">
        <div className="footer-col">
          <h3>About</h3>
          <p>
            This site was created by{' '}
            <a target="_blank" rel="noopener noreferrer" href="http://twitter.com/johnmpotter">
              John Potter
            </a>{' '}
            and is maintained by{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://ui.dev">
              uidotdev
            </a>
            . If you find any bugs or have a feature request, please open an issue on{' '}
            <a target="_blank" rel="noopener noreferrer" href="http://github.com/uidotdev/npm-trends">
              github
            </a>
            !
          </p>

          <h3>More</h3>
          <ul className="list-unstyled">
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://ui.dev">
                Learn JavaScript
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://ui.dev/react-query">
                Learn React Query
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://ui.dev/react-router-tutorial">
                React Router Tutorial
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://useHooks.com">
                React Hook Recipes
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://bytes.dev">
                Bytes JavaScript Newsletter
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://reactnewsletter.com">
                React Newsletter
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
