import Fetch from './Fetch';

class Package {
  static fetchStats(packet) {
    return Promise.all([this.fetchGithubStats(packet)]).then(([github]) => ({ github }));
  }

  static fetchGithubStats(packet) {
    return new Promise(resolve => {
      if (packet.repository && packet.repository.url.indexOf('github') >= 0) {
        const repositoryUrl = packet.repository.url.split('.com')[1].replace('.git', '');
        const githubUrl = `https://api.github.com/repos${repositoryUrl}`;

        Fetch.getJSON(`${process.env.REACT_APP_PROXY_URL}/?url=${githubUrl}`)
          .then(response => {
            resolve(response);
          })
          .catch(() => {
            const packetData = { name: packet.name };
            resolve(packetData);
          });
      } else {
        const packetData = { name: packet.name };
        resolve(packetData);
      }
    });
  }
}

export default Package;
