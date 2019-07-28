import * as http from 'https';

const cors = require('cors')({origin: true});
const WP_BASE_URL = 'https://tech.uqido.com/wp-json/wp/v2/';
const options = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

// @ts-ignore
const techArticles = (req, res) => {
  cors(req, res, () => {
    const categoriesRequest = http.get(`${WP_BASE_URL}categories`, options, response => {
      let categoriesData = '';
      response.on('data', (chunk) => {
        categoriesData += chunk;
      });
      response.on('end', () => {
        const categoriesDataParsed = JSON.parse(categoriesData);
        const categoriesId: any = [];
        categoriesDataParsed.forEach((category: any) => {
          categoriesId.push(category.id);
        });
        const promises: Promise<any>[] = [];
        categoriesId.forEach((id: any) => {
          const p = new Promise((resolve, reject) => {
            const postsRequest = http.get(`${WP_BASE_URL}posts?categories=${id}`, options, response => {
              let postsData = '';
              response.on('data', (chunk) => {
                postsData += chunk;
              });
              response.on('end', () => resolve(JSON.parse(postsData)));
            });
            postsRequest.end();
          }).then(result => {
            return result;
          }).catch(err => console.log(err));
          promises.push(p)
        });
        Promise.all(promises).then((postsArray: Array<any[]>) => {
          const articlesData: any = [];
          postsArray.forEach((posts: any[]) => {
            posts.forEach((post: any) => {
              const data = JSON.stringify({
                author: "",
                description: post.title.rendered,
                createdAt: post.date,
                keyId: req.params
              });
              const updateRequest = http.request('https://us-central1-okr-platform.cloudfunctions.net/metricsCreate',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                  }
                }, response => {
                res.on('end', () => {
                  console.log(response);
                });
              });
              updateRequest.write(data);
              updateRequest.end();
              articlesData.push(data);
            });
          });
          res.send(articlesData);
        }).catch(err => console.log(err));
      });
    });
    categoriesRequest.end();
  })
};

module.exports = techArticles;
