import * as http from 'https';

const cors = require('cors')({origin: true});

// @ts-ignore
const clockifyWorkspaces = (req, res) => {
  cors(req, res, () => {

    const mainRequest = http.get('https://api.clockify.me/api/v1/workspaces?name=uqido', {headers: {'x-api-key': 'W1sZgLB5hzV8VkX5'}}, response => {
      let workspaceData = '';
      response.on('data', (chunk) => {
        workspaceData += chunk;
      });
      response.on('end', () => {
        const dataParsed = JSON.parse(workspaceData);
        const workspaceId = dataParsed[0].id;

        const projectRequest = http.get(`https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects?name=learning`, {headers: {'x-api-key': 'W1sZgLB5hzV8VkX5'}}, response => {
          let projectData = '';
          response.on('data', (chunk) => {
            projectData += chunk;
          });
          response.on('end', () => {
            const dataParsed = JSON.parse(projectData);
            // @ts-ignore
            const learningProjectId = dataParsed[0].id;

            const usersRequest = http.get(`https://api.clockify.me/api/v1/workspace/${workspaceId}/users`, {headers: {'x-api-key': 'W1sZgLB5hzV8VkX5'}}, response => {
              let userData = '';
              response.on('data', (chunk) => {
                userData += chunk;
              });
              response.on('end', () => {
                const dataParsed = JSON.parse(userData);
                const users: any = [];
                dataParsed.forEach((user: any) => {
                  users.push(user.id);
                });

                const promises: Promise<any>[] = [];
                users.forEach((user: any) => {
                  const p = new Promise((resolve, reject) => {
                    const timeEntries = http.get(`https://api.clockify.me/api/v1/workspaces/${workspaceId}/user/${user}/time-entries`, {headers: {'x-api-key': 'W1sZgLB5hzV8VkX5'}}, response => {
                      let timeEntriesData = '';
                      response.on('data', (chunk) => {
                        timeEntriesData += chunk;
                      });
                      response.on('end', () => resolve(JSON.parse(timeEntriesData)));
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
                })
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

module.exports = clockifyWorkspaces;
