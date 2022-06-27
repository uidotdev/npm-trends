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

const EmailSignup = ({ subcount = 105000 }: { subcount?: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const subscribe = (event) => {
    event.preventDefault();
    if (!email) return;
    setIsLoading(true);
    sendBytesOptIn({ email, source: 'useHooks' }).then((res) => {
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
            <h3>Sick of boring newsletters?</h3>
            <p>Bytes is a weekly dose of JavaScript, delivered every Monday.</p>
            <br />

            <form onSubmit={subscribe}>
              <div className="control">
                <input
                  type="email"
                  className="email-signup-input"
                  placeholder="Your Email"
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
              Loved by{' '}
              <a href="https://twitter.com/uidotdev/timelines/1428028877129936899">{subcount.toLocaleString()}</a>{' '}
              developers.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSignup;
