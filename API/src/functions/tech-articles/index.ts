import * as http from 'https';

const cors = require('cors')({origin: true});
const WP_BASE_URL = 'https://tech.uqido.com/wp-json/wp/v2/posts?per_page=50&after=2019-07-01T00:00:00';
const options = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

// @ts-ignore
const techArticles = (req, res) => {
  cors(req, res, () => {
    // const diff = 60 * 60 * 24 * 1000;  // milliseconds in a day
    // if((new Date().getTime() - key.lastUpdate.getTime()) / diff > 7) {
    //   const keyUpdateRequest = http.request('https://us-central1-okr-platform.cloudfunctions.net/metricsUpdate',
    //     {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     }, keyUpdateResponse => {
    //       res.on('end', () => {
    //         console.log(keyUpdateResponse);
    //       });
    //     });
    //   keyUpdateRequest.write(JSON.stringify(new Date()));
    //   keyUpdateRequest.end();
    // }
    const postsRequest = http.get(WP_BASE_URL, options, getResponse => {
      let postsData = '';
      getResponse.on('data', (chunk) => {
        postsData += chunk;
      });
      getResponse.on('end', () => {
        const metricsRequest = http.get(`https://us-central1-okr-platform.cloudfunctions.net/metrics?keyId=${req.params[0]}`, metricsResponse => {
          let metricsData = '';
          metricsResponse.on('data', (chunk) => {
            metricsData += chunk;
          });
          metricsResponse.on('end', () => {
            const metricsDataParsed = JSON.parse(metricsData);
            const postsDataParsed = JSON.parse(postsData);
            const posts: any = [];
            postsDataParsed.forEach((post: any) => {
              const data = {
                author: '',
                createdAt: post.date,
                postId: post.id,
                description: post.title.rendered,
                keyId: req.params[0]
              };
              posts.push(data);
              let isPresent = false;
              metricsDataParsed.forEach((metric: any) => {
                if (metric.postId === post.id) {
                  isPresent = true;
                }
              });
              if (!isPresent) {
                const updateRequest = http.request('https://us-central1-okr-platform.cloudfunctions.net/metricsCreate',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }, updateResponse => {
                    res.on('end', () => {
                      console.log(updateResponse);
                    });
                  });
                updateRequest.write(JSON.stringify(data));
                updateRequest.end();
              }
            });
            res.send(posts);
          });
        });
        metricsRequest.end();
      });
      postsRequest.end();
    })
  })
};
module.exports = techArticles;
