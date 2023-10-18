const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-content">
        <div className="footer-col">
          <h3>About</h3>
          <p>
            This site was created by{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/johnmpotter">
              John Potter
            </a>{' '}
            and is maintained by{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://ui.dev">
              uidotdev
            </a>
            . If you find any bugs or have a feature request, please open an issue on{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/uidotdev/npm-trends">
              github
            </a>
            !
          </p>

          <h3>More</h3>
          <ul className="list-unstyled">
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://ui.dev">
                ui.dev
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://react.gg">
                Learn React with react.gg
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://query.gg">
                query.gg
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://usehooks.com">
                useHooks
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
