import { useState } from 'react';

function sendBytesOptIn({ email, source }) {
  return fetch(`https://bytes.dev/api/bytes-optin-cors`, {
    method: 'POST',
    body: JSON.stringify({ email, source }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

const EmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const subscribe = (event) => {
    event.preventDefault();
    if (!email) return;
    setIsLoading(true);
    sendBytesOptIn({ email, source: 'npmtrends' }).then((res) => {
      if (res.error) {
        setEmail('');
        setIsLoading(false);
      }
      setSubscribed(true);
      setIsLoading(false);
      setEmail('');
    });
  };

  return (
    <div className="email-signup">
      <div className="card-content">
        {subscribed ? (
          <div className="has-text-centered has-text-weight-semibold">
            You are subscribed&nbsp;&nbsp;
            <span role="img" aria-label="party">
              🎉
            </span>
          </div>
        ) : (
          <>
            <h3>Sick of boring JavaScript newsletters?
              <img className="bytes-logo-small" height="40" width="40" alt="Bytes newsletter logo" src='https://react-query.tanstack.com/images/bytes-logo.png' />
            </h3>
            <p><a href="https://bytes.dev">Bytes</a> is a JavaScript newsletter you'll actually enjoy reading.</p>
            <p>Delivered every Monday, for free.</p>
            <br />

            <form onSubmit={subscribe}>
              <div className="control">
                <input
                  type="email"
                  className="email-signup-input"
                  placeholder="tyler@leftpad.com"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <button disabled={isLoading} className="email-signup-button" type="submit">
                  {isLoading ? 'Loading...' : 'Get Bytes'}
                </button>
              </div>
            </form>
            <p className="email-signup-subtext">
              <a href="https://twitter.com/uidotdev/timelines/1428028877129936899">Loved by over 100,000 developers</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSignup;
