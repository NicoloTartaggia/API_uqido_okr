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
    // res.setHeader('Access-Control-Allow-Origin:', 'http://localhost:4200/');
    const categoriesRequest = http.get(`${WP_BASE_URL}categories`, options, response => {
      let categoriesData = '';
      response.on('data', (chunk) => {
        categoriesData += chunk;
      });
      response.on('end', () => {
        const categoriesDataParsed = JSON.parse(categoriesData);
        const categoryId: any = [];
        categoriesDataParsed.forEach((category: any) => {
          categoryId.push(category.id);
        });
        const promises: Promise<any>[] = [];
        categoryId.forEach((id: any) => {
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
        Promise.all(promises).then(posts => {
          res.send(posts);
        }).catch(err => console.log(err));
      });
    });
    categoriesRequest.end();
  })
};

module.exports = techArticles;
