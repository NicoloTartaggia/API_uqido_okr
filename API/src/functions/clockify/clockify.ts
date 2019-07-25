import * as http from 'https';

const cors = require('cors')({origin: true});
const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api/v1/';
const options = {
  headers: {
    'x-api-key': 'W1sZgLB5hzV8VkX5'
  },
  'Access-Control-Allow-Origin': '*'
};


// @ts-ignore
const clockify = (req, res) => {
  cors(req, res, () => {

    const mainRequest = http.get(`${CLOCKIFY_BASE_URL}workspaces?name=uqido`, options, response => {
      let workspaceData = '';
      response.on('data', (chunk) => {
        workspaceData += chunk;
      });
      response.on('end', () => {
        const dataParsed = JSON.parse(workspaceData);
        const workspaceId = dataParsed[0].id;

        const projectRequest = http.get(`${CLOCKIFY_BASE_URL}workspaces/${workspaceId}/projects?name=learning`, options, projectResponse => {
          let projectData = '';
          projectResponse.on('data', (chunk) => {
            projectData += chunk;
          });
          projectResponse.on('end', () => {
            const projectDataParsed = JSON.parse(projectData);
            // @ts-ignore
            const learningProjectId = projectDataParsed[0].id;

            const usersRequest = http.get(`${CLOCKIFY_BASE_URL}workspace/${workspaceId}/users`, options, usersResponse => {
              let userData = '';
              usersResponse.on('data', (chunk) => {
                userData += chunk;
              });
              usersResponse.on('end', () => {
                const usersDataParsed = JSON.parse(userData);
                const users: any = [];
                usersDataParsed.forEach((user: any) => {
                  users.push(user.id);
                });

                const promises: Promise<any>[] = [];
                users.forEach((user: any) => {
                  const p = new Promise((resolve, reject) => {
                    const timeEntries = http.get(`${CLOCKIFY_BASE_URL}workspaces/${workspaceId}/user/${user}/time-entries`, options, timeEntriesResponse => {
                      let timeEntriesData = '';
                      timeEntriesResponse.on('data', (chunk) => {
                        timeEntriesData += chunk;
                      });
                      timeEntriesResponse.on('end', () => resolve(JSON.parse(timeEntriesData)));
                    });
                    timeEntries.end();
                  }).then(result => {
                    // @ts-ignore
                    return result.filter((entry: any) => entry.projectId === learningProjectId);
                  })
                    .catch(err => console.log(err));
                  promises.push(p)
                });
                Promise.all(promises).then(timeEntriesArray => {
                  res.send(timeEntriesArray);
                }).catch(err => console.log(err));
              })
            });
            usersRequest.end();
          });
        });
        projectRequest.end();
      });
    });
    mainRequest.end();
  });
};

module.exports = clockify;
