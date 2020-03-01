import Fetch from './Fetch';

class Package {
  static fetchStats(packet) {
    return Promise.all([
      this.fetchGithubStats(packet),
    ])
      .then(([github]) => {
        return { github };
      });
  }

  static fetchGithubStats(packet) {
    return new Promise((resolve) => {
      if (packet.repository && (packet.repository.url.indexOf('github') >= 0)){
        var repository_url = packet.repository.url.split('.com')[1].replace('.git', '');
        var github_url = "https://api.github.com/repos" + repository_url;

        Fetch.getJSON(window.proxyUrl + github_url)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            var packet_data = {name: packet.name};
            resolve(packet_data);
          });
      }else{
        var packet_data = {name: packet.name};
        resolve(packet_data);
      }
    });
  }
}

export default Package;
